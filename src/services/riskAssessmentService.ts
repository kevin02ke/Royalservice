import { UserProfile, PlatformSettings, KycStatus, UserKycData, AntiFraudEvent } from '../types';
import { 
  findUserById, 
  updateUserBalance, 
  logAntiFraudEvent, 
  getPlatformSettings,
  getNeonSql
} from './neonDb';

export interface RiskEvaluationResult {
  userId: string;
  previousRiskScore: number;
  newRiskScore: number;
  riskFlags: string[];
  requiresKyc: boolean;
  isHighRisk: boolean;
  shouldFreeze: boolean;
  eventLogs: string[];
}

export interface TransactionAssessmentInput {
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment';
  amountKES: number;
  destination?: string;
  clientIp?: string;
  pastWithdrawalsCount24h?: number;
  totalWithdrawn24hKES?: number;
}

/**
 * RiskAssessmentService
 * Monitors transaction frequency, velocity, abnormal sizing, destination mismatches,
 * and circular abuse to calculate dynamic risk scores (0-100) and enforce KYC.
 */
export class RiskAssessmentService {
  /**
   * Evaluates incoming or outgoing transaction pattern and returns risk telemetry
   */
  public static async assessTransactionRisk(input: TransactionAssessmentInput): Promise<RiskEvaluationResult> {
    const user = await findUserById(input.userId);
    const settings = await getPlatformSettings();

    if (!user) {
      return {
        userId: input.userId,
        previousRiskScore: 0,
        newRiskScore: 100,
        riskFlags: ['USER_NOT_FOUND'],
        requiresKyc: true,
        isHighRisk: true,
        shouldFreeze: true,
        eventLogs: ['Assessment called for non-existent user profile'],
      };
    }

    let riskScore = Number(user.riskScore || 0);
    const flags: string[] = Array.isArray(user.riskFlags) ? [...user.riskFlags] : [];
    const eventLogs: string[] = [];

    const kycThreshold = Number(settings.kycRiskScoreThreshold || 60);
    const maxDailyLimit = Number(settings.maxDailyWithdrawalKES || 50000);

    // 1. Transaction Sizing Check (Sudden large withdrawal vs historical capital)
    if (input.type === 'withdrawal') {
      // Overdraft / balance tampering probe
      if (input.amountKES > user.walletBalanceKES) {
        riskScore += 45;
        const f = 'OVERDRAFT_ATTEMPT';
        if (!flags.includes(f)) flags.push(f);
        eventLogs.push(`Attempted withdrawal (KES ${input.amountKES}) exceeds ledger balance (KES ${user.walletBalanceKES})`);
      }

      // Sizing anomaly: Single withdrawal exceeding standard daily threshold
      if (input.amountKES > maxDailyLimit) {
        riskScore += 25;
        const f = 'ABNORMAL_TRANSACTION_SIZE';
        if (!flags.includes(f)) flags.push(f);
        eventLogs.push(`Single withdrawal size (KES ${input.amountKES}) exceeds safe velocity threshold (KES ${maxDailyLimit})`);
      }

      // 2. Frequency / Velocity Check in 24h window
      const dailyVelocity = (input.totalWithdrawn24hKES || 0) + input.amountKES;
      if (dailyVelocity > maxDailyLimit) {
        riskScore += 30;
        const f = 'DAILY_VELOCITY_LIMIT_EXCEEDED';
        if (!flags.includes(f)) flags.push(f);
        eventLogs.push(`24-hour payout velocity (KES ${dailyVelocity}) exceeds cap (KES ${maxDailyLimit})`);
      }

      // Frequency spike (more than 3 withdrawal attempts in rolling period)
      if ((input.pastWithdrawalsCount24h || 0) >= 3) {
        riskScore += 20;
        const f = 'HIGH_FREQUENCY_WITHDRAWALS';
        if (!flags.includes(f)) flags.push(f);
        eventLogs.push(`High withdrawal frequency: ${input.pastWithdrawalsCount24h} attempts in 24 hours`);
      }

      // 3. Destination Phone Discrepancy Check (M-Pesa)
      if (input.destination && settings.strictPhoneMatchEnabled !== false) {
        const cleanDest = input.destination.replace(/[^0-9]/g, '');
        const cleanUserPhone = user.phone.replace(/[^0-9]/g, '');
        if (cleanDest && cleanUserPhone && !cleanDest.endsWith(cleanUserPhone.slice(-7)) && !cleanUserPhone.endsWith(cleanDest.slice(-7))) {
          riskScore += 25;
          const f = 'DESTINATION_PHONE_MISMATCH';
          if (!flags.includes(f)) flags.push(f);
          eventLogs.push(`Destination account (${input.destination}) does not match registered phone (${user.phone})`);
        }
      }
    }

    // Clamp risk score to 0-100
    const clampedScore = Math.min(100, Math.max(0, riskScore));
    const isHighRisk = clampedScore >= kycThreshold;
    const shouldFreeze = clampedScore >= 85 && settings.autoFreezeHighRisk !== false;

    // Determine KYC Requirement
    const requiresKyc = (settings.kycRequiredForHighRisk !== false && isHighRisk && user.kycStatus !== 'APPROVED');

    // Persist updated risk score and flags to database
    await this.updateUserRiskProfile(user.id, {
      riskScore: clampedScore,
      riskFlags: flags,
      kycStatus: requiresKyc && (!user.kycStatus || user.kycStatus === 'NOT_REQUIRED') ? 'REQUIRED' : user.kycStatus,
      isFrozen: shouldFreeze ? true : user.isFrozen,
      freezeReason: shouldFreeze && !user.freezeReason ? `Automated lock: High risk score (${clampedScore}/100)` : user.freezeReason,
    });

    if (requiresKyc && (!user.kycStatus || user.kycStatus === 'NOT_REQUIRED')) {
      await logAntiFraudEvent({
        id: `afe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        eventType: 'KYC_TRIGGERED',
        userId: user.id,
        userIdentifier: `${user.name} (${user.phone})`,
        riskScore: clampedScore,
        severity: 'high',
        actionTaken: 'KYC_ENFORCED',
        details: `Risk score reached ${clampedScore}/${100}. Forced KYC identity clearance before payouts. Flags: ${flags.join(', ')}`,
        ipAddress: input.clientIp,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      userId: user.id,
      previousRiskScore: Number(user.riskScore || 0),
      newRiskScore: clampedScore,
      riskFlags: flags,
      requiresKyc,
      isHighRisk,
      shouldFreeze,
      eventLogs,
    };
  }

  /**
   * Force or toggle KYC requirement for a specific user directly from Admin Panel
   */
  public static async setForceKyc(userId: string, force: boolean, adminReason?: string): Promise<{ success: boolean; newStatus: KycStatus; message: string }> {
    const user = await findUserById(userId);
    if (!user) {
      return { success: false, newStatus: 'NOT_REQUIRED', message: 'User profile not found' };
    }

    const newKycStatus: KycStatus = force ? 'REQUIRED' : 'NOT_REQUIRED';
    const updatedRiskScore = force ? Math.max(Number(user.riskScore || 0), 65) : Math.min(Number(user.riskScore || 0), 20);

    const flags: string[] = Array.isArray(user.riskFlags) ? [...user.riskFlags] : [];
    if (force && !flags.includes('ADMIN_MANDATED_KYC')) {
      flags.push('ADMIN_MANDATED_KYC');
    } else if (!force) {
      const idx = flags.indexOf('ADMIN_MANDATED_KYC');
      if (idx !== -1) flags.splice(idx, 1);
    }

    await this.updateUserRiskProfile(userId, {
      kycStatus: newKycStatus,
      riskScore: updatedRiskScore,
      riskFlags: flags,
    });

    await logAntiFraudEvent({
      id: `afe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: force ? 'KYC_TRIGGERED' : 'RISK_SCORE_ELEVATED',
      userId,
      userIdentifier: `${user.name} (${user.phone})`,
      riskScore: updatedRiskScore,
      severity: force ? 'medium' : 'low',
      actionTaken: force ? 'KYC_ENFORCED' : 'RESOLVED',
      details: force 
        ? `Administrator manually enforced KYC verification. Reason: ${adminReason || 'Compliance audit'}` 
        : `Administrator waived KYC verification requirement.`,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      newStatus: newKycStatus,
      message: force ? 'KYC requirement has been enforced for this user.' : 'KYC requirement removed.',
    };
  }

  /**
   * Submits KYC verification documents for a high-risk user
   */
  public static async submitKyc(userId: string, kycData: Omit<UserKycData, 'submittedAt'>): Promise<{ success: boolean; message: string }> {
    const user = await findUserById(userId);
    if (!user) {
      return { success: false, message: 'User profile not found' };
    }

    const completeKycData: UserKycData = {
      ...kycData,
      submittedAt: new Date().toISOString(),
    };

    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          UPDATE users 
          SET kyc_status = 'SUBMITTED',
              kyc_data = ${JSON.stringify(completeKycData)}::jsonb
          WHERE id = ${userId};
        `;
      } catch (err) {
        console.warn('[RiskAssessmentService] Neon submitKyc error:', err);
      }
    }

    await logAntiFraudEvent({
      id: `afe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: 'KYC_SUBMITTED',
      userId,
      userIdentifier: `${user.name} (${user.phone})`,
      riskScore: Number(user.riskScore || 0),
      severity: 'low',
      actionTaken: 'FLAGGED_FOR_REVIEW',
      details: `User uploaded ${kycData.documentType} (No. ${kycData.documentNumber}) for identity verification.`,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'KYC documents submitted successfully. Verification takes 10 to 30 minutes.',
    };
  }

  /**
   * Compliance Admin approves KYC submission, clears risk flags, and unlocks payouts
   */
  public static async approveKyc(userId: string, adminNotes?: string): Promise<{ success: boolean; message: string }> {
    const user = await findUserById(userId);
    if (!user) {
      return { success: false, message: 'User profile not found' };
    }

    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          UPDATE users 
          SET kyc_status = 'APPROVED',
              risk_score = 0,
              is_frozen = FALSE,
              freeze_reason = NULL,
              risk_flags = '[]'::jsonb
          WHERE id = ${userId};
        `;
      } catch (err) {
        console.warn('[RiskAssessmentService] Neon approveKyc error:', err);
      }
    }

    await logAntiFraudEvent({
      id: `afe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: 'KYC_APPROVED',
      userId,
      userIdentifier: `${user.name} (${user.phone})`,
      riskScore: 0,
      severity: 'low',
      actionTaken: 'RESOLVED',
      details: `Compliance audit approved KYC identity credentials. Risk score cleared to 0. Payouts unblocked. Notes: ${adminNotes || 'Verified Gov ID match'}`,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'KYC cleared and account restored to trusted standing.',
    };
  }

  /**
   * Compliance Admin rejects KYC submission with actionable feedback
   */
  public static async rejectKyc(userId: string, reason: string): Promise<{ success: boolean; message: string }> {
    const user = await findUserById(userId);
    if (!user) {
      return { success: false, message: 'User profile not found' };
    }

    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          UPDATE users 
          SET kyc_status = 'REJECTED'
          WHERE id = ${userId};
        `;
      } catch (err) {
        console.warn('[RiskAssessmentService] Neon rejectKyc error:', err);
      }
    }

    await logAntiFraudEvent({
      id: `afe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: 'KYC_REJECTED',
      userId,
      userIdentifier: `${user.name} (${user.phone})`,
      riskScore: Number(user.riskScore || 65),
      severity: 'medium',
      actionTaken: 'BLOCKED',
      details: `KYC submission rejected by compliance officer: ${reason}`,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: `KYC submission marked as rejected: ${reason}`,
    };
  }

  /**
   * Helper: Updates risk columns in Neon DB
   */
  private static async updateUserRiskProfile(
    userId: string,
    updates: {
      riskScore?: number;
      riskFlags?: string[];
      kycStatus?: KycStatus;
      isFrozen?: boolean;
      freezeReason?: string;
    }
  ): Promise<void> {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          UPDATE users 
          SET 
            risk_score = COALESCE(${updates.riskScore ?? null}, risk_score),
            risk_flags = COALESCE(${updates.riskFlags ? JSON.stringify(updates.riskFlags) : null}::jsonb, risk_flags),
            kyc_status = COALESCE(${updates.kycStatus ?? null}, kyc_status),
            is_frozen = COALESCE(${updates.isFrozen ?? null}, is_frozen),
            freeze_reason = COALESCE(${updates.freezeReason ?? null}, freeze_reason)
          WHERE id = ${userId};
        `;
      } catch (err) {
        console.warn('[RiskAssessmentService] updateUserRiskProfile Neon error:', err);
      }
    }
  }
}
