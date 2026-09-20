export interface InvestmentPackage {
  id: string;
  name: string;
  tag?: string;
  priceKES: number;
  dailyRoiPercent: number; // e.g. 3.0 for 3%
  durationDays: number;    // e.g. 30
  description: string;
  isActive: boolean;
  color: string;
  features: string[];
}

export interface ActiveInvestment {
  id: string;
  packageId: string;
  packageName: string;
  amountKES: number;
  dailyRoiPercent: number;
  dailyReturnKES: number;
  durationDays: number;
  daysElapsed: number;
  totalEarnedKES: number;
  unclaimedYieldKES: number;
  startDate: string;
  lastClaimDate: string;
  status: 'active' | 'completed';
}

export type WithdrawalMethod = 'mpesa' | 'binance';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amountKES: number;
  method: WithdrawalMethod;
  destination: string; // Phone number for M-Pesa or Binance Pay ID / USDT address
  accountName?: string;
  feeKES: number;
  netAmountKES: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  estimatedDelivery: string;
  txHashOrRef: string;
  rejectionReason?: string;
}

export interface ReferralMember {
  id: string;
  name: string;
  phoneOrEmail: string;
  tier: 1 | 2 | 3;
  referredBy: string;
  joinedDate: string;
  totalDepositedKES: number;
  commissionEarnedKES: number;
  packageActive: string;
  status: 'active' | 'inactive';
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'investment' | 'daily_yield' | 'referral_bonus' | 'withdrawal';
  amountKES: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'processing' | 'rejected';
  reference: string;
  destination?: string;
}

export interface PlatformSettings {
  minWithdrawalKES: number;
  mpesaEstimatedHours: number;
  binanceInstantEnabled: boolean;
  tier1CommissionPercent: number; // e.g. 7%
  tier2CommissionPercent: number; // e.g. 3%
  tier3CommissionPercent: number; // e.g. 1%
  usdtToKesExchangeRate: number;  // e.g. 130 KES = 1 USDT
  platformStatus: 'active' | 'maintenance';
  mpesaWithdrawalFeePercent: number;  // 10%
  binanceWithdrawalFeePercent: number; // 5%
  payheroApiKey?: string;
  payheroChannelId?: string;
  payheroEnabled?: boolean;
  // Anti-Fraud & Risk Shield Settings
  antiFraudEnabled?: boolean;
  maxDailyWithdrawalKES?: number;
  withdrawalCooldownHours?: number;
  strictPhoneMatchEnabled?: boolean;
  autoFreezeHighRisk?: boolean;
  // Risk-Based KYC Settings
  kycRequiredForHighRisk?: boolean;
  kycRiskScoreThreshold?: number; // default e.g. 60
}

export interface PayHeroInitiateResponse {
  success: boolean;
  message: string;
  reference: string;
  externalReference: string;
  status: 'Queued' | 'Success' | 'Failed' | 'Pending';
}

export interface PayHeroCallbackPayload {
  success: boolean;
  status: 'success' | 'failed';
  message: string;
  reference: string;
  external_reference: string;
  amount: number;
  currency: string;
  transaction_id: string;
  transaction_date: string;
  transaction_type: string;
  provider_reference?: string;
  provider?: string;
}

export type KycStatus = 'NOT_REQUIRED' | 'REQUIRED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface UserKycData {
  documentType: 'NATIONAL_ID' | 'PASSPORT' | 'DRIVING_LICENSE';
  documentNumber: string;
  frontPhotoUrl: string;
  backPhotoUrl?: string;
  selfiePhotoUrl: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  referredByCode?: string;
  walletBalanceKES: number;
  investedCapitalKES: number;
  totalEarningsAccruedKES: number;
  totalReferralBonusKES: number;
  totalWithdrawnKES: number;
  isFrozen?: boolean;
  riskScore?: number;
  riskFlags?: string[];
  freezeReason?: string;
  // Risk-Triggered KYC status
  kycStatus?: KycStatus;
  kycData?: UserKycData;
}

export interface AntiFraudEvent {
  id: string;
  eventType: 
    | 'SELF_REFERRAL_ATTEMPT' 
    | 'VELOCITY_LIMIT_EXCEEDED' 
    | 'UNAUTHORIZED_BALANCE_DRAIN' 
    | 'REPLAY_ATTACK_PREVENTED' 
    | 'SUSPICIOUS_WITHDRAWAL' 
    | 'ACCOUNT_FROZEN' 
    | 'ACCOUNT_UNFROZEN' 
    | 'RISK_SCORE_ELEVATED'
    | 'KYC_TRIGGERED'
    | 'KYC_SUBMITTED'
    | 'KYC_APPROVED'
    | 'KYC_REJECTED';
  userId?: string;
  userIdentifier?: string;
  riskScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionTaken: 'BLOCKED' | 'FLAGGED_FOR_REVIEW' | 'ACCOUNT_AUTO_FROZEN' | 'RESOLVED' | 'KYC_ENFORCED';
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AntiFraudMetrics {
  totalBlockedExploits: number;
  flaggedAccountsCount: number;
  frozenAccountsCount: number;
  highRiskWithdrawalsCount: number;
  kycPendingCount?: number;
  kycRequiredForHighRisk?: boolean;
  kycRiskScoreThreshold?: number;
  antiFraudEnabled: boolean;
  maxDailyWithdrawalKES: number;
  withdrawalCooldownHours: number;
  strictPhoneMatchEnabled: boolean;
  autoFreezeHighRisk: boolean;
}

export interface ChatAttachment {
  name: string;
  sizeBytes: number;
  type: string; // 'image/png', 'application/pdf', etc.
  dataUrl: string; // base64 or object URL
}

export interface ChatVoiceNote {
  audioData: string; // base64 data URI or blob URL
  durationSec: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  sender: 'user' | 'admin' | 'system';
  senderName: string;
  text?: string;
  timestamp: string;
  isRead: boolean;
  voiceNote?: ChatVoiceNote;
  attachment?: ChatAttachment;
}

export interface ChatThread {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  userReferralCode: string;
  status: 'active' | 'resolved' | 'escalated';
  unreadCountUser: number;
  unreadCountAdmin: number;
  lastMessageTime: string;
  lastMessageSnippet: string;
  messages: ChatMessage[];
}

