import { neon } from '@neondatabase/serverless';
import { 
  InvestmentPackage, 
  ActiveInvestment, 
  Transaction, 
  WithdrawalRequest, 
  ReferralMember, 
  PlatformSettings, 
  UserProfile,
  ChatMessage,
  ChatThread,
  AntiFraudEvent,
  AntiFraudMetrics
} from '../types';

export interface UserRecord extends UserProfile {
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// ----------------------------------------------------
// DEFAULT SEED DATA
// ----------------------------------------------------
export const defaultPlatformSettings: PlatformSettings = {
  minWithdrawalKES: 100,
  mpesaEstimatedHours: 6,
  binanceInstantEnabled: true,
  tier1CommissionPercent: 7,
  tier2CommissionPercent: 3,
  tier3CommissionPercent: 1,
  usdtToKesExchangeRate: 130,
  platformStatus: 'active',
  mpesaWithdrawalFeePercent: 10,
  binanceWithdrawalFeePercent: 5,
};

export const defaultPackages: InvestmentPackage[] = [
  {
    id: 'pkg-bronze',
    name: 'Royal Bronze',
    tag: 'Starter Tier',
    priceKES: 500,
    dailyRoiPercent: 8.0,
    durationDays: 20,
    description: 'Entry package paying KES 40/day for exactly 20 days. Capital is non-refundable; contract expires upon completion.',
    isActive: true,
    color: 'from-amber-600 to-amber-700',
    features: [
      'Daily 8.0% return (KES 40/day)',
      'Total Payout: KES 800 (160%)',
      'Contract cycle: Exactly 20 Days',
      'Capital Non-Refundable • Expired at term',
      'Instant Binance / M-Pesa payouts',
    ],
  },
  {
    id: 'pkg-silver',
    name: 'Royal Silver',
    tag: 'Most Popular',
    priceKES: 900,
    dailyRoiPercent: 10.0,
    durationDays: 20,
    description: 'Premier balanced package paying KES 90 per day for exactly 20 days. Capital is non-refundable; expires after 20 days.',
    isActive: true,
    color: 'from-emerald-500 to-teal-700',
    features: [
      'Daily 10.0% return (KES 90/day)',
      'Total Payout: KES 1,800 (200%)',
      'Contract cycle: Exactly 20 Days',
      'Capital Non-Refundable • Expired at term',
      'Eligible for Multi-tier Team Bonus',
      'Minimum withdrawal from KES 100',
    ],
  },
  {
    id: 'pkg-gold',
    name: 'Royal Gold',
    tag: 'High Yield',
    priceKES: 2500,
    dailyRoiPercent: 10.0,
    durationDays: 20,
    description: 'Accelerated yield contract paying KES 250 per day for exactly 20 days. Capital non-refundable.',
    isActive: true,
    color: 'from-yellow-500 to-amber-600',
    features: [
      'Daily 10.0% return (KES 250/day)',
      'Total Payout: KES 5,000 (200%)',
      'Contract cycle: Exactly 20 Days',
      'Capital Non-Refundable • Expired at term',
      'Priority M-Pesa & Instant Binance API',
      'Unlocks Tier 2 & Tier 3 referral booster',
    ],
  },
  {
    id: 'pkg-platinum',
    name: 'Royal Platinum',
    tag: 'Elite Tier',
    priceKES: 6000,
    dailyRoiPercent: 11.0,
    durationDays: 20,
    description: 'Executive capital contract paying KES 660 per day for exactly 20 days. Capital expires without refund.',
    isActive: true,
    color: 'from-purple-600 to-indigo-700',
    features: [
      'Daily 11.0% return (KES 660/day)',
      'Total Payout: KES 13,200 (220%)',
      'Contract cycle: Exactly 20 Days',
      'Capital Non-Refundable • Expired at term',
      'Instant settlement on all rails',
      'Direct account manager support',
    ],
  },
];

export const seedUsers: UserRecord[] = [
  {
    id: 'usr-98214',
    name: 'Jane Wanjiku',
    email: 'j.wanjiku@investor.ke',
    phone: '+254 712 345 678',
    passwordHash: 'password123',
    referralCode: 'ROYAL-JANE77',
    referredByCode: 'ROYAL-KEN99',
    walletBalanceKES: 1450,
    investedCapitalKES: 900,
    totalEarningsAccruedKES: 2340,
    totalReferralBonusKES: 875,
    totalWithdrawnKES: 1750,
    role: 'user',
    createdAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'usr-10022',
    name: 'Kennedy Omondi',
    email: 'ken.omondi@gmail.com',
    phone: '+254 722 890 123',
    passwordHash: 'password123',
    referralCode: 'ROYAL-KEN99',
    referredByCode: undefined,
    walletBalanceKES: 4200,
    investedCapitalKES: 2500,
    totalEarningsAccruedKES: 5000,
    totalReferralBonusKES: 1650,
    totalWithdrawnKES: 3100,
    role: 'user',
    createdAt: '2026-08-15T08:30:00.000Z',
  },
  {
    id: 'usr-admin-01',
    name: 'Royal Service VIP Admin',
    email: 'admin@royalservice.ke',
    phone: '+254 700 000 001',
    passwordHash: 'admin2026',
    referralCode: 'ROYAL-MASTER',
    referredByCode: undefined,
    walletBalanceKES: 50000,
    investedCapitalKES: 0,
    totalEarningsAccruedKES: 0,
    totalReferralBonusKES: 0,
    totalWithdrawnKES: 0,
    role: 'admin',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
];

export const seedInvestments: ActiveInvestment[] = [
  {
    id: 'inv-001',
    packageId: 'pkg-silver',
    packageName: 'Royal Silver',
    amountKES: 900,
    dailyRoiPercent: 10.0,
    dailyReturnKES: 90,
    durationDays: 20,
    daysElapsed: 6,
    totalEarnedKES: 540,
    unclaimedYieldKES: 90,
    startDate: '2026-09-13',
    lastClaimDate: '2026-09-18',
    status: 'active',
  },
  {
    id: 'inv-002',
    packageId: 'pkg-bronze',
    packageName: 'Royal Bronze',
    amountKES: 500,
    dailyRoiPercent: 8.0,
    dailyReturnKES: 40,
    durationDays: 20,
    daysElapsed: 20,
    totalEarnedKES: 800,
    unclaimedYieldKES: 0,
    startDate: '2026-08-25',
    lastClaimDate: '2026-09-14',
    status: 'completed',
  },
];

export const seedTransactions: Transaction[] = [
  {
    id: 'tx-101',
    type: 'deposit',
    amountKES: 2600,
    description: 'M-Pesa Express STK Push Deposit',
    date: '2026-09-07 10:14',
    status: 'completed',
    reference: 'RK789210M',
  },
  {
    id: 'tx-102',
    type: 'investment',
    amountKES: 900,
    description: 'Activated Royal Silver (10% daily for 20 days)',
    date: '2026-09-07 10:18',
    status: 'completed',
    reference: 'INV-001',
  },
  {
    id: 'tx-103',
    type: 'referral_bonus',
    amountKES: 182,
    description: 'Tier 1 Referral Bonus from Kevin Ochieng (7%)',
    date: '2026-09-08 16:30',
    status: 'completed',
    reference: 'REF-T1-881',
  },
  {
    id: 'tx-104',
    type: 'daily_yield',
    amountKES: 540,
    description: 'Claimed 6-day daily return batch',
    date: '2026-09-17 08:00',
    status: 'completed',
    reference: 'YIELD-9912',
  },
  {
    id: 'tx-105',
    type: 'withdrawal',
    amountKES: 750,
    description: 'Instant Binance Pay Withdrawal',
    date: '2026-09-18 14:22',
    status: 'completed',
    reference: 'BINANCE-TX-9938210948',
  },
  {
    id: 'tx-106',
    type: 'withdrawal',
    amountKES: 350,
    description: 'M-Pesa Withdrawal (Estimated within 6 hours)',
    date: '2026-09-19 07:45',
    status: 'processing',
    reference: 'PEND-MP-20260919-441',
  },
];

export const seedWithdrawals: WithdrawalRequest[] = [
  {
    id: 'wth-001',
    userId: 'usr-98214',
    userName: 'Jane Wanjiku',
    amountKES: 750,
    method: 'binance',
    destination: 'BINANCE_PAY_ID: 88419204 (USDT: 5.76)',
    accountName: 'Binance User #88419204',
    feeKES: 0,
    netAmountKES: 750,
    status: 'completed',
    createdAt: '2026-09-18 14:22',
    estimatedDelivery: 'Instant Automated via Binance API',
    txHashOrRef: 'BINANCE-TX-9938210948',
  },
  {
    id: 'wth-002',
    userId: 'usr-98214',
    userName: 'Jane Wanjiku',
    amountKES: 1000,
    method: 'mpesa',
    destination: '+254 712 345 678',
    accountName: 'Jane Wanjiku',
    feeKES: 0,
    netAmountKES: 1000,
    status: 'completed',
    createdAt: '2026-09-14 09:10',
    estimatedDelivery: 'Disbursed via Safaricom B2C in 3h 15m',
    txHashOrRef: 'QD872JKA90',
  },
  {
    id: 'wth-003',
    userId: 'usr-98214',
    userName: 'Jane Wanjiku',
    amountKES: 350,
    method: 'mpesa',
    destination: '+254 712 345 678',
    accountName: 'Jane Wanjiku',
    feeKES: 0,
    netAmountKES: 350,
    status: 'processing',
    createdAt: '2026-09-19 07:45',
    estimatedDelivery: 'Est. within 6 hours (Queue: #14)',
    txHashOrRef: 'PEND-MP-20260919-441',
  },
];

export const seedReferrals: ReferralMember[] = [
  {
    id: 'ref-01',
    name: 'Kevin Ochieng',
    phoneOrEmail: '+254 722 *** 119',
    tier: 1,
    referredBy: 'Jane Wanjiku',
    joinedDate: '2026-09-08',
    totalDepositedKES: 2600,
    commissionEarnedKES: 182,
    packageActive: 'Silver Explorer (x2)',
    status: 'active',
  },
  {
    id: 'ref-02',
    name: 'Faith Mutua',
    phoneOrEmail: '+254 733 *** 842',
    tier: 1,
    referredBy: 'Jane Wanjiku',
    joinedDate: '2026-09-10',
    totalDepositedKES: 1300,
    commissionEarnedKES: 91,
    packageActive: 'Silver Explorer',
    status: 'active',
  },
  {
    id: 'ref-03',
    name: 'Brian Kiprop',
    phoneOrEmail: '+254 740 *** 501',
    tier: 1,
    referredBy: 'Jane Wanjiku',
    joinedDate: '2026-09-12',
    totalDepositedKES: 3500,
    commissionEarnedKES: 245,
    packageActive: 'Gold Pro',
    status: 'active',
  },
  {
    id: 'ref-04',
    name: 'Samuel Ndung’u',
    phoneOrEmail: '+254 718 *** 990',
    tier: 2,
    referredBy: 'Kevin Ochieng',
    joinedDate: '2026-09-13',
    totalDepositedKES: 3900,
    commissionEarnedKES: 117,
    packageActive: 'Silver Explorer (x3)',
    status: 'active',
  },
  {
    id: 'ref-05',
    name: 'Mercy Chebet',
    phoneOrEmail: '+254 799 *** 204',
    tier: 2,
    referredBy: 'Faith Mutua',
    joinedDate: '2026-09-15',
    totalDepositedKES: 1300,
    commissionEarnedKES: 39,
    packageActive: 'Silver Explorer',
    status: 'active',
  },
  {
    id: 'ref-06',
    name: 'Dennis K.',
    phoneOrEmail: '+254 705 *** 318',
    tier: 3,
    referredBy: 'Samuel Ndung’u',
    joinedDate: '2026-09-16',
    totalDepositedKES: 2600,
    commissionEarnedKES: 26,
    packageActive: 'Silver Explorer (x2)',
    status: 'active',
  },
];

export const initialChatThreads: ChatThread[] = [
  {
    id: 'thread-user-001',
    userId: 'user-001',
    userName: 'Jane Wanjiru',
    userPhone: '+254 712 345 678',
    userEmail: 'jane.wanjiru@gmail.com',
    userReferralCode: 'ROYAL-JANE77',
    status: 'active',
    unreadCountUser: 1,
    unreadCountAdmin: 0,
    lastMessageTime: '10:45 AM',
    lastMessageSnippet: 'Welcome Jane! We are available 24/7 for daily payout and deposit verification.',
    messages: [
      {
        id: 'msg-101',
        threadId: 'thread-user-001',
        sender: 'system',
        senderName: 'Royal Concierge System',
        text: 'Private communication session established with Royal Service VIP Desk. End-to-end audit enabled.',
        timestamp: '09:00 AM',
        isRead: true,
      },
      {
        id: 'msg-102',
        threadId: 'thread-user-001',
        sender: 'user',
        senderName: 'Jane Wanjiru',
        text: 'Hello, I just activated my Royal Silver contract (KES 900). When will my first KES 90 daily payout reflect in my wallet?',
        timestamp: '10:30 AM',
        isRead: true,
      },
      {
        id: 'msg-103',
        threadId: 'thread-user-001',
        sender: 'admin',
        senderName: 'VIP Support Manager (Assigned #VIP-402)',
        text: 'Welcome Jane! Your KES 90 daily payout accrues every 24 hours automatically into your withdrawable ledger balance. You can withdraw anytime once your balance exceeds KES 100 via Binance Pay or M-Pesa.',
        timestamp: '10:45 AM',
        isRead: false,
      },
    ],
  },
  {
    id: 'thread-user-002',
    userId: 'user-002',
    userName: 'Kennedy Omondi',
    userPhone: '+254 722 890 123',
    userEmail: 'ken.omondi@gmail.com',
    userReferralCode: 'ROYAL-KEN99',
    status: 'active',
    unreadCountUser: 0,
    unreadCountAdmin: 1,
    lastMessageTime: '10:15 AM',
    lastMessageSnippet: 'Uploaded M-Pesa transaction screenshot for KES 2,500 deposit confirmation.',
    messages: [
      {
        id: 'msg-201',
        threadId: 'thread-user-002',
        sender: 'system',
        senderName: 'Royal Concierge System',
        text: 'Support session initialized for Tier 1 Partner Kennedy Omondi.',
        timestamp: '09:15 AM',
        isRead: true,
      },
      {
        id: 'msg-202',
        threadId: 'thread-user-002',
        sender: 'user',
        senderName: 'Kennedy Omondi',
        text: 'Good morning, please verify my deposit of KES 2,500 for the Royal Gold contract. I have attached the M-Pesa confirmation receipt.',
        timestamp: '10:15 AM',
        isRead: false,
      },
    ],
  },
  {
    id: 'thread-user-003',
    userId: 'user-003',
    userName: 'Faith Cherono',
    userPhone: '+254 733 456 789',
    userEmail: 'faith.cherono@yahoo.com',
    userReferralCode: 'ROYAL-FAITH12',
    status: 'resolved',
    unreadCountUser: 0,
    unreadCountAdmin: 0,
    lastMessageTime: 'Yesterday',
    lastMessageSnippet: 'Withdrawal of KES 1,200 via Binance Pay USDT completed successfully.',
    messages: [
      {
        id: 'msg-301',
        threadId: 'thread-user-003',
        sender: 'user',
        senderName: 'Faith Cherono',
        text: 'Can I withdraw my daily yields directly in USDT to Binance Pay PayID?',
        timestamp: 'Yesterday 02:10 PM',
        isRead: true,
      },
      {
        id: 'msg-302',
        threadId: 'thread-user-003',
        sender: 'admin',
        senderName: 'Finance Support Lead (Assigned #Fin-302)',
        text: 'Yes Faith! Binance Pay instant settlement is enabled 24/7 with zero network fees. Your KES yields are converted at the transparent platform rate.',
        timestamp: 'Yesterday 02:15 PM',
        isRead: true,
      },
    ],
  },
];

// Fallback in-memory stores in case of transient disconnection
let memoryUsers: UserRecord[] = [...seedUsers];
let memoryPackages: InvestmentPackage[] = JSON.parse(JSON.stringify(defaultPackages));
let memoryInvestments: ActiveInvestment[] = JSON.parse(JSON.stringify(seedInvestments));
let memoryTransactions: Transaction[] = JSON.parse(JSON.stringify(seedTransactions));
let memoryWithdrawals: WithdrawalRequest[] = JSON.parse(JSON.stringify(seedWithdrawals));
let memoryReferrals: ReferralMember[] = JSON.parse(JSON.stringify(seedReferrals));
let memoryThreads: ChatThread[] = JSON.parse(JSON.stringify(initialChatThreads));
let memorySettings: PlatformSettings = { ...defaultPlatformSettings };

const DEFAULT_NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_TXm6UtSlW7Ae@ep-little-hall-b5o6vcsm-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export function cleanPostgresUrl(input?: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/postgres(?:ql)?:\/\/[^\s'"`\)\;]+/);
  return match ? match[0] : trimmed;
}

export function getNeonSql() {
  const raw = process.env.DATABASE_URL || DEFAULT_NEON_DATABASE_URL;
  const connectionString = cleanPostgresUrl(raw);
  if (!connectionString) {
    return null;
  }
  try {
    return neon(connectionString);
  } catch (err) {
    console.warn('[Neon DB] Error initializing Neon client:', err);
    return null;
  }
}

export const sql = getNeonSql();

let isSchemaInitialized = false;

// ----------------------------------------------------
// SCHEMA INITIALIZATION & SEEDING ON NEON POSTGRESQL
// ----------------------------------------------------
export async function initNeonSchema(): Promise<boolean> {
  const sql = getNeonSql();
  if (!sql) {
    console.warn('[Neon DB] No SQL connection available for schema init.');
    return false;
  }
  if (isSchemaInitialized) return true;

  try {
    console.log('[Neon DB] Initializing tables on Neon Postgres (Project: ep-little-hall-b5o6vcsm)...');

    // 1. Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        phone VARCHAR(64) UNIQUE NOT NULL,
        password_hash VARCHAR(256) NOT NULL,
        referral_code VARCHAR(64) UNIQUE NOT NULL,
        referred_by_code VARCHAR(64),
        wallet_balance_kes NUMERIC DEFAULT 0,
        invested_capital_kes NUMERIC DEFAULT 0,
        total_earnings_accrued_kes NUMERIC DEFAULT 0,
        total_referral_bonus_kes NUMERIC DEFAULT 0,
        total_withdrawn_kes NUMERIC DEFAULT 0,
        role VARCHAR(32) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Investment Packages table
    await sql`
      CREATE TABLE IF NOT EXISTS investment_packages (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        tag VARCHAR(64),
        price_kes NUMERIC NOT NULL,
        daily_roi_percent NUMERIC NOT NULL,
        duration_days INT NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        color VARCHAR(64),
        features JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. User Investments table
    await sql`
      CREATE TABLE IF NOT EXISTS user_investments (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        package_id VARCHAR(64) NOT NULL,
        package_name VARCHAR(128) NOT NULL,
        amount_kes NUMERIC NOT NULL,
        daily_roi_percent NUMERIC NOT NULL,
        daily_return_kes NUMERIC NOT NULL,
        duration_days INT NOT NULL,
        days_elapsed INT DEFAULT 0,
        total_earned_kes NUMERIC DEFAULT 0,
        unclaimed_yield_kes NUMERIC DEFAULT 0,
        start_date VARCHAR(64) NOT NULL,
        last_claim_date VARCHAR(64),
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        type VARCHAR(32) NOT NULL,
        amount_kes NUMERIC NOT NULL,
        status VARCHAR(32) NOT NULL,
        date_str VARCHAR(64) NOT NULL,
        description TEXT NOT NULL,
        reference_code VARCHAR(128),
        destination VARCHAR(128),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 5. Withdrawals table
    await sql`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        user_name VARCHAR(128) NOT NULL,
        amount_kes NUMERIC NOT NULL,
        fee_kes NUMERIC NOT NULL DEFAULT 0,
        net_amount_kes NUMERIC NOT NULL,
        method VARCHAR(32) NOT NULL,
        destination VARCHAR(128) NOT NULL,
        account_name VARCHAR(128),
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        estimated_delivery VARCHAR(128),
        tx_hash_or_ref VARCHAR(128),
        created_at_str VARCHAR(64) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Referrals table
    await sql`
      CREATE TABLE IF NOT EXISTS referrals (
        id VARCHAR(64) PRIMARY KEY,
        referrer_id VARCHAR(64) NOT NULL,
        name VARCHAR(128) NOT NULL,
        phone_or_email VARCHAR(128) NOT NULL,
        tier INT NOT NULL,
        referred_by VARCHAR(128) NOT NULL,
        joined_date VARCHAR(64) NOT NULL,
        total_deposited_kes NUMERIC DEFAULT 0,
        commission_earned_kes NUMERIC DEFAULT 0,
        package_active VARCHAR(128),
        status VARCHAR(32) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 7. Chat Threads table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_threads (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        user_name VARCHAR(128) NOT NULL,
        user_phone VARCHAR(64),
        user_email VARCHAR(128),
        user_referral_code VARCHAR(64),
        status VARCHAR(32) DEFAULT 'active',
        unread_count_user INT DEFAULT 0,
        unread_count_admin INT DEFAULT 0,
        last_message_time VARCHAR(64),
        last_message_snippet TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 8. Chat Messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(64) PRIMARY KEY,
        thread_id VARCHAR(64) NOT NULL,
        sender VARCHAR(32) NOT NULL,
        sender_name VARCHAR(128) NOT NULL,
        text TEXT,
        timestamp_str VARCHAR(64) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        voice_note JSONB,
        attachment JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 9. Platform Settings table
    await sql`
      CREATE TABLE IF NOT EXISTS platform_settings (
        id VARCHAR(64) PRIMARY KEY,
        min_withdrawal_kes NUMERIC DEFAULT 100,
        mpesa_estimated_hours INT DEFAULT 6,
        binance_instant_enabled BOOLEAN DEFAULT TRUE,
        tier1_commission_percent NUMERIC DEFAULT 7.0,
        tier2_commission_percent NUMERIC DEFAULT 3.0,
        tier3_commission_percent NUMERIC DEFAULT 1.0,
        usdt_to_kes_exchange_rate NUMERIC DEFAULT 130.0,
        platform_status VARCHAR(32) DEFAULT 'active',
        mpesa_withdrawal_fee_percent NUMERIC DEFAULT 10.0,
        binance_withdrawal_fee_percent NUMERIC DEFAULT 5.0,
        anti_fraud_enabled BOOLEAN DEFAULT TRUE,
        max_daily_withdrawal_kes NUMERIC DEFAULT 50000,
        withdrawal_cooldown_hours INT DEFAULT 24,
        strict_phone_match_enabled BOOLEAN DEFAULT TRUE,
        auto_freeze_high_risk BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 10. Anti-Fraud Events table
    await sql`
      CREATE TABLE IF NOT EXISTS anti_fraud_events (
        id VARCHAR(64) PRIMARY KEY,
        event_type VARCHAR(64) NOT NULL,
        user_id VARCHAR(64),
        user_identifier VARCHAR(128),
        risk_score INT DEFAULT 0,
        severity VARCHAR(16) DEFAULT 'medium',
        action_taken VARCHAR(64) NOT NULL,
        details TEXT,
        ip_address VARCHAR(64),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ensure columns exist on existing tables if already created
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN DEFAULT FALSE;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS risk_score INT DEFAULT 0;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS risk_flags JSONB DEFAULT '[]'::jsonb;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS freeze_reason TEXT;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(32) DEFAULT 'NOT_REQUIRED';`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_data JSONB DEFAULT NULL;`;

      await sql`ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS anti_fraud_enabled BOOLEAN DEFAULT TRUE;`;
      await sql`ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS max_daily_withdrawal_kes NUMERIC DEFAULT 50000;`;
      await sql`ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS withdrawal_cooldown_hours INT DEFAULT 24;`;
      await sql`ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS strict_phone_match_enabled BOOLEAN DEFAULT TRUE;`;
      await sql`ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS auto_freeze_high_risk BOOLEAN DEFAULT TRUE;`;
      await sql`ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS kyc_required_for_high_risk BOOLEAN DEFAULT TRUE;`;
      await sql`ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS kyc_risk_score_threshold INT DEFAULT 60;`;
    } catch (alterErr) {
      console.warn('[Neon DB] Column migration check notice:', alterErr);
    }

    console.log('[Neon DB] Tables verified successfully. Verifying seed data in Neon...');

    // Seed Users
    const userCountRes = await sql`SELECT count(*) as count FROM users;`;
    if (userCountRes && Number(userCountRes[0].count) === 0) {
      for (const u of seedUsers) {
        await sql`
          INSERT INTO users (
            id, name, email, phone, password_hash, referral_code, referred_by_code,
            wallet_balance_kes, invested_capital_kes, total_earnings_accrued_kes,
            total_referral_bonus_kes, total_withdrawn_kes, role, created_at
          ) VALUES (
            ${u.id}, ${u.name}, ${u.email}, ${u.phone}, ${u.passwordHash}, ${u.referralCode}, ${u.referredByCode || null},
            ${u.walletBalanceKES}, ${u.investedCapitalKES}, ${u.totalEarningsAccruedKES},
            ${u.totalReferralBonusKES}, ${u.totalWithdrawnKES}, ${u.role}, ${u.createdAt}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
      console.log('[Neon DB] Seeded users table.');
    }

    // Seed Investment Packages
    const pkgCountRes = await sql`SELECT count(*) as count FROM investment_packages;`;
    if (pkgCountRes && Number(pkgCountRes[0].count) === 0) {
      for (const p of defaultPackages) {
        await sql`
          INSERT INTO investment_packages (
            id, name, tag, price_kes, daily_roi_percent, duration_days, description,
            is_active, color, features
          ) VALUES (
            ${p.id}, ${p.name}, ${p.tag || null}, ${p.priceKES}, ${p.dailyRoiPercent}, ${p.durationDays},
            ${p.description}, ${p.isActive}, ${p.color}, ${JSON.stringify(p.features)}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
      console.log('[Neon DB] Seeded investment_packages table.');
    }

    // Seed User Investments
    const invCountRes = await sql`SELECT count(*) as count FROM user_investments;`;
    if (invCountRes && Number(invCountRes[0].count) === 0) {
      for (const inv of seedInvestments) {
        await sql`
          INSERT INTO user_investments (
            id, user_id, package_id, package_name, amount_kes, daily_roi_percent,
            daily_return_kes, duration_days, days_elapsed, total_earned_kes, unclaimed_yield_kes,
            start_date, last_claim_date, status
          ) VALUES (
            ${inv.id}, 'usr-98214', ${inv.packageId}, ${inv.packageName}, ${inv.amountKES}, ${inv.dailyRoiPercent},
            ${inv.dailyReturnKES}, ${inv.durationDays}, ${inv.daysElapsed}, ${inv.totalEarnedKES}, ${inv.unclaimedYieldKES},
            ${inv.startDate}, ${inv.lastClaimDate}, ${inv.status}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
      console.log('[Neon DB] Seeded user_investments table.');
    }

    // Seed Transactions
    const txCountRes = await sql`SELECT count(*) as count FROM transactions;`;
    if (txCountRes && Number(txCountRes[0].count) === 0) {
      for (const t of seedTransactions) {
        await sql`
          INSERT INTO transactions (
            id, user_id, type, amount_kes, status, date_str, description, reference_code, destination
          ) VALUES (
            ${t.id}, 'usr-98214', ${t.type}, ${t.amountKES}, ${t.status}, ${t.date},
            ${t.description}, ${t.reference}, ${t.destination || null}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
      console.log('[Neon DB] Seeded transactions table.');
    }

    // Seed Withdrawals
    const wthCountRes = await sql`SELECT count(*) as count FROM withdrawals;`;
    if (wthCountRes && Number(wthCountRes[0].count) === 0) {
      for (const w of seedWithdrawals) {
        await sql`
          INSERT INTO withdrawals (
            id, user_id, user_name, amount_kes, fee_kes, net_amount_kes, method,
            destination, account_name, status, estimated_delivery, tx_hash_or_ref, created_at_str
          ) VALUES (
            ${w.id}, ${w.userId}, ${w.userName}, ${w.amountKES}, ${w.feeKES}, ${w.netAmountKES}, ${w.method},
            ${w.destination}, ${w.accountName || null}, ${w.status}, ${w.estimatedDelivery}, ${w.txHashOrRef}, ${w.createdAt}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
      console.log('[Neon DB] Seeded withdrawals table.');
    }

    // Seed Referrals
    const refCountRes = await sql`SELECT count(*) as count FROM referrals;`;
    if (refCountRes && Number(refCountRes[0].count) === 0) {
      for (const r of seedReferrals) {
        await sql`
          INSERT INTO referrals (
            id, referrer_id, name, phone_or_email, tier, referred_by, joined_date,
            total_deposited_kes, commission_earned_kes, package_active, status
          ) VALUES (
            ${r.id}, 'usr-98214', ${r.name}, ${r.phoneOrEmail}, ${r.tier}, ${r.referredBy}, ${r.joinedDate},
            ${r.totalDepositedKES}, ${r.commissionEarnedKES}, ${r.packageActive}, ${r.status}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
      console.log('[Neon DB] Seeded referrals table.');
    }

    // Seed Chat Threads & Messages
    const threadCountRes = await sql`SELECT count(*) as count FROM chat_threads;`;
    if (threadCountRes && Number(threadCountRes[0].count) === 0) {
      for (const th of initialChatThreads) {
        await sql`
          INSERT INTO chat_threads (
            id, user_id, user_name, user_phone, user_email, user_referral_code,
            status, unread_count_user, unread_count_admin, last_message_time, last_message_snippet
          ) VALUES (
            ${th.id}, ${th.userId}, ${th.userName}, ${th.userPhone}, ${th.userEmail}, ${th.userReferralCode},
            ${th.status}, ${th.unreadCountUser}, ${th.unreadCountAdmin}, ${th.lastMessageTime}, ${th.lastMessageSnippet}
          ) ON CONFLICT (id) DO NOTHING;
        `;
        for (const msg of th.messages) {
          await sql`
            INSERT INTO chat_messages (
              id, thread_id, sender, sender_name, text, timestamp_str, is_read, voice_note, attachment
            ) VALUES (
              ${msg.id}, ${th.id}, ${msg.sender}, ${msg.senderName}, ${msg.text || null},
              ${msg.timestamp}, ${msg.isRead}, ${msg.voiceNote ? JSON.stringify(msg.voiceNote) : null},
              ${msg.attachment ? JSON.stringify(msg.attachment) : null}
            ) ON CONFLICT (id) DO NOTHING;
          `;
        }
      }
      console.log('[Neon DB] Seeded chat_threads and chat_messages.');
    }

    // Seed Platform Settings
    const settingsCountRes = await sql`SELECT count(*) as count FROM platform_settings;`;
    if (settingsCountRes && Number(settingsCountRes[0].count) === 0) {
      await sql`
        INSERT INTO platform_settings (
          id, min_withdrawal_kes, mpesa_estimated_hours, binance_instant_enabled,
          tier1_commission_percent, tier2_commission_percent, tier3_commission_percent,
          usdt_to_kes_exchange_rate, platform_status, mpesa_withdrawal_fee_percent, binance_withdrawal_fee_percent
        ) VALUES (
          'default', ${defaultPlatformSettings.minWithdrawalKES}, ${defaultPlatformSettings.mpesaEstimatedHours},
          ${defaultPlatformSettings.binanceInstantEnabled}, ${defaultPlatformSettings.tier1CommissionPercent},
          ${defaultPlatformSettings.tier2CommissionPercent}, ${defaultPlatformSettings.tier3CommissionPercent},
          ${defaultPlatformSettings.usdtToKesExchangeRate}, ${defaultPlatformSettings.platformStatus},
          ${defaultPlatformSettings.mpesaWithdrawalFeePercent}, ${defaultPlatformSettings.binanceWithdrawalFeePercent}
        ) ON CONFLICT (id) DO NOTHING;
      `;
      console.log('[Neon DB] Seeded platform_settings.');
    }

    isSchemaInitialized = true;
    console.log('[Neon DB] All 9 tables initialized and verified successfully on Neon PostgreSQL.');
    return true;
  } catch (error) {
    console.error('[Neon DB] Failed to initialize Neon Postgres schema:', error);
    return false;
  }
}

// ----------------------------------------------------
// DATABASE STATUS & METRICS
// ----------------------------------------------------
export async function getDbStatus(): Promise<{
  isNeonConnected: boolean;
  projectId: string;
  databaseUrlConfigured: boolean;
  counts: {
    users: number;
    packages: number;
    investments: number;
    transactions: number;
    withdrawals: number;
    referrals: number;
    chatThreads: number;
    chatMessages: number;
  };
}> {
  const activeConnString = cleanPostgresUrl(process.env.DATABASE_URL || DEFAULT_NEON_DATABASE_URL);
  const isConfigured = Boolean(activeConnString && activeConnString.length > 0);
  let isConnected = false;

  const counts = {
    users: memoryUsers.length,
    packages: memoryPackages.length,
    investments: memoryInvestments.length,
    transactions: memoryTransactions.length,
    withdrawals: memoryWithdrawals.length,
    referrals: memoryReferrals.length,
    chatThreads: memoryThreads.length,
    chatMessages: memoryThreads.reduce((acc, t) => acc + t.messages.length, 0),
  };

  if (isConfigured) {
    try {
      const sql = getNeonSql();
      if (sql) {
        const [u, p, inv, tx, w, ref, th, m] = await Promise.all([
          sql`SELECT count(*) as count FROM users;`.catch(() => [{ count: 0 }]),
          sql`SELECT count(*) as count FROM investment_packages;`.catch(() => [{ count: 0 }]),
          sql`SELECT count(*) as count FROM user_investments;`.catch(() => [{ count: 0 }]),
          sql`SELECT count(*) as count FROM transactions;`.catch(() => [{ count: 0 }]),
          sql`SELECT count(*) as count FROM withdrawals;`.catch(() => [{ count: 0 }]),
          sql`SELECT count(*) as count FROM referrals;`.catch(() => [{ count: 0 }]),
          sql`SELECT count(*) as count FROM chat_threads;`.catch(() => [{ count: 0 }]),
          sql`SELECT count(*) as count FROM chat_messages;`.catch(() => [{ count: 0 }]),
        ]);
        isConnected = true;
        counts.users = Number(u[0]?.count || 0);
        counts.packages = Number(p[0]?.count || 0);
        counts.investments = Number(inv[0]?.count || 0);
        counts.transactions = Number(tx[0]?.count || 0);
        counts.withdrawals = Number(w[0]?.count || 0);
        counts.referrals = Number(ref[0]?.count || 0);
        counts.chatThreads = Number(th[0]?.count || 0);
        counts.chatMessages = Number(m[0]?.count || 0);
      }
    } catch (err) {
      console.warn('[Neon DB] getDbStatus failed:', err);
      isConnected = false;
    }
  }

  return {
    isNeonConnected: isConnected,
    projectId: 'ep-little-hall-b5o6vcsm',
    databaseUrlConfigured: isConfigured,
    counts,
  };
}

// ----------------------------------------------------
// USERS CRUD
// ----------------------------------------------------
export async function findUserByEmailOrPhone(identifier: string): Promise<UserRecord | null> {
  const cleanId = identifier.trim().toLowerCase();
  const sql = getNeonSql();

  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, name, email, phone, password_hash as "passwordHash", referral_code as "referralCode",
          referred_by_code as "referredByCode", wallet_balance_kes as "walletBalanceKES",
          invested_capital_kes as "investedCapitalKES", total_earnings_accrued_kes as "totalEarningsAccruedKES",
          total_referral_bonus_kes as "totalReferralBonusKES", total_withdrawn_kes as "totalWithdrawnKES",
          role, created_at as "createdAt",
          is_frozen as "isFrozen", risk_score as "riskScore", risk_flags as "riskFlags", freeze_reason as "freezeReason",
          kyc_status as "kycStatus", kyc_data as "kycData"
        FROM users
        WHERE LOWER(email) = ${cleanId} OR phone = ${identifier.trim()}
        LIMIT 1;
      `;
      if (rows && rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          passwordHash: r.passwordHash,
          referralCode: r.referralCode,
          referredByCode: r.referredByCode || undefined,
          walletBalanceKES: Number(r.walletBalanceKES || 0),
          investedCapitalKES: Number(r.investedCapitalKES || 0),
          totalEarningsAccruedKES: Number(r.totalEarningsAccruedKES || 0),
          totalReferralBonusKES: Number(r.totalReferralBonusKES || 0),
          totalWithdrawnKES: Number(r.totalWithdrawnKES || 0),
          role: r.role || 'user',
          createdAt: String(r.createdAt),
          isFrozen: Boolean(r.isFrozen),
          riskScore: Number(r.riskScore || 0),
          riskFlags: Array.isArray(r.riskFlags) ? r.riskFlags : [],
          freezeReason: r.freezeReason || undefined,
          kycStatus: r.kycStatus || 'NOT_REQUIRED',
          kycData: r.kycData || undefined,
        };
      }
    } catch (err) {
      console.warn('[Neon DB] User lookup error, using memory fallback:', err);
    }
  }

  return memoryUsers.find(
    u => u.email.toLowerCase() === cleanId || u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '')
  ) || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, name, email, phone, password_hash as "passwordHash", referral_code as "referralCode",
          referred_by_code as "referredByCode", wallet_balance_kes as "walletBalanceKES",
          invested_capital_kes as "investedCapitalKES", total_earnings_accrued_kes as "totalEarningsAccruedKES",
          total_referral_bonus_kes as "totalReferralBonusKES", total_withdrawn_kes as "totalWithdrawnKES",
          role, created_at as "createdAt",
          is_frozen as "isFrozen", risk_score as "riskScore", risk_flags as "riskFlags", freeze_reason as "freezeReason",
          kyc_status as "kycStatus", kyc_data as "kycData"
        FROM users
        WHERE id = ${id}
        LIMIT 1;
      `;
      if (rows && rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          passwordHash: r.passwordHash,
          referralCode: r.referralCode,
          referredByCode: r.referredByCode || undefined,
          walletBalanceKES: Number(r.walletBalanceKES || 0),
          investedCapitalKES: Number(r.investedCapitalKES || 0),
          totalEarningsAccruedKES: Number(r.totalEarningsAccruedKES || 0),
          totalReferralBonusKES: Number(r.totalReferralBonusKES || 0),
          totalWithdrawnKES: Number(r.totalWithdrawnKES || 0),
          role: r.role || 'user',
          createdAt: String(r.createdAt),
          isFrozen: Boolean(r.isFrozen),
          riskScore: Number(r.riskScore || 0),
          riskFlags: Array.isArray(r.riskFlags) ? r.riskFlags : [],
          freezeReason: r.freezeReason || undefined,
          kycStatus: r.kycStatus || 'NOT_REQUIRED',
          kycData: r.kycData || undefined,
        };
      }
    } catch (err) {
      console.warn('[Neon DB] findUserById error:', err);
    }
  }

  return memoryUsers.find(u => u.id === id) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  referredByCode?: string;
}): Promise<UserRecord> {
  const id = `usr-${Date.now().toString().slice(-6)}`;
  const namePrefix = data.name.trim().split(/\s+/)[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'VIP';
  const randSuffix = Math.floor(10 + Math.random() * 90);
  const referralCode = `ROYAL-${namePrefix}${randSuffix}`;

  const newUser: UserRecord = {
    id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    passwordHash: data.password,
    referralCode,
    referredByCode: data.referredByCode?.trim() || undefined,
    walletBalanceKES: 100, // Welcome starter balance
    investedCapitalKES: 0,
    totalEarningsAccruedKES: 0,
    totalReferralBonusKES: 0,
    totalWithdrawnKES: 0,
    role: 'user',
    createdAt: new Date().toISOString(),
    kycStatus: 'NOT_REQUIRED',
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO users (
          id, name, email, phone, password_hash, referral_code, referred_by_code,
          wallet_balance_kes, invested_capital_kes, total_earnings_accrued_kes,
          total_referral_bonus_kes, total_withdrawn_kes, role, created_at
        ) VALUES (
          ${newUser.id}, ${newUser.name}, ${newUser.email}, ${newUser.phone}, ${newUser.passwordHash},
          ${newUser.referralCode}, ${newUser.referredByCode || null}, ${newUser.walletBalanceKES},
          ${newUser.investedCapitalKES}, ${newUser.totalEarningsAccruedKES}, ${newUser.totalReferralBonusKES},
          ${newUser.totalWithdrawnKES}, ${newUser.role}, ${newUser.createdAt}
        );
      `;
      console.log(`[Neon DB] Registered user saved to Neon Postgres: ${newUser.name} (${newUser.email})`);
    } catch (err) {
      console.warn('[Neon DB] createUser insert failed:', err);
    }
  }

  memoryUsers.unshift(newUser);
  return newUser;
}

export async function listAllUsers(): Promise<UserProfile[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, name, email, phone, referral_code as "referralCode",
          referred_by_code as "referredByCode", wallet_balance_kes as "walletBalanceKES",
          invested_capital_kes as "investedCapitalKES", total_earnings_accrued_kes as "totalEarningsAccruedKES",
          total_referral_bonus_kes as "totalReferralBonusKES", total_withdrawn_kes as "totalWithdrawnKES",
          is_frozen as "isFrozen", risk_score as "riskScore", risk_flags as "riskFlags", freeze_reason as "freezeReason",
          kyc_status as "kycStatus", kyc_data as "kycData"
        FROM users
        ORDER BY created_at DESC;
      `;
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        referralCode: r.referralCode,
        referredByCode: r.referredByCode || undefined,
        walletBalanceKES: Number(r.walletBalanceKES || 0),
        investedCapitalKES: Number(r.investedCapitalKES || 0),
        totalEarningsAccruedKES: Number(r.totalEarningsAccruedKES || 0),
        totalReferralBonusKES: Number(r.totalReferralBonusKES || 0),
        totalWithdrawnKES: Number(r.totalWithdrawnKES || 0),
        isFrozen: Boolean(r.isFrozen),
        riskScore: Number(r.riskScore || 0),
        riskFlags: Array.isArray(r.riskFlags) ? r.riskFlags : [],
        freezeReason: r.freezeReason || undefined,
        kycStatus: r.kycStatus || 'NOT_REQUIRED',
        kycData: r.kycData || undefined,
      }));
    } catch (err) {
      console.warn('[Neon DB] listAllUsers failed:', err);
    }
  }

  return memoryUsers.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    referralCode: u.referralCode,
    referredByCode: u.referredByCode,
    walletBalanceKES: u.walletBalanceKES,
    investedCapitalKES: u.investedCapitalKES,
    totalEarningsAccruedKES: u.totalEarningsAccruedKES,
    totalReferralBonusKES: u.totalReferralBonusKES,
    totalWithdrawnKES: u.totalWithdrawnKES,
  }));
}

export async function updateUserBalance(
  userId: string, 
  updates: Partial<Pick<UserProfile, 'walletBalanceKES' | 'investedCapitalKES' | 'totalEarningsAccruedKES' | 'totalReferralBonusKES' | 'totalWithdrawnKES'>>
): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      if (updates.walletBalanceKES !== undefined) {
        await sql`UPDATE users SET wallet_balance_kes = ${updates.walletBalanceKES} WHERE id = ${userId};`;
      }
      if (updates.investedCapitalKES !== undefined) {
        await sql`UPDATE users SET invested_capital_kes = ${updates.investedCapitalKES} WHERE id = ${userId};`;
      }
      if (updates.totalEarningsAccruedKES !== undefined) {
        await sql`UPDATE users SET total_earnings_accrued_kes = ${updates.totalEarningsAccruedKES} WHERE id = ${userId};`;
      }
      if (updates.totalReferralBonusKES !== undefined) {
        await sql`UPDATE users SET total_referral_bonus_kes = ${updates.totalReferralBonusKES} WHERE id = ${userId};`;
      }
      if (updates.totalWithdrawnKES !== undefined) {
        await sql`UPDATE users SET total_withdrawn_kes = ${updates.totalWithdrawnKES} WHERE id = ${userId};`;
      }
    } catch (err) {
      console.warn('[Neon DB] updateUserBalance failed:', err);
    }
  }

  const memUser = memoryUsers.find(u => u.id === userId);
  if (memUser) {
    Object.assign(memUser, updates);
    return true;
  }
  return false;
}

// ----------------------------------------------------
// INVESTMENT PACKAGES CRUD
// ----------------------------------------------------
export async function getAllPackages(): Promise<InvestmentPackage[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, name, tag, price_kes as "priceKES", daily_roi_percent as "dailyRoiPercent",
          duration_days as "durationDays", description, is_active as "isActive",
          color, features
        FROM investment_packages
        ORDER BY price_kes ASC;
      `;
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.id,
          name: r.name,
          tag: r.tag || undefined,
          priceKES: Number(r.priceKES),
          dailyRoiPercent: Number(r.dailyRoiPercent),
          durationDays: Number(r.durationDays),
          description: r.description || '',
          isActive: Boolean(r.isActive),
          color: r.color || 'from-indigo-600 to-purple-700',
          features: Array.isArray(r.features) ? r.features : (typeof r.features === 'string' ? JSON.parse(r.features) : []),
        }));
      }
    } catch (err) {
      console.warn('[Neon DB] getAllPackages query failed:', err);
    }
  }

  return memoryPackages;
}

export async function createInvestmentPackage(pkg: InvestmentPackage): Promise<InvestmentPackage> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO investment_packages (
          id, name, tag, price_kes, daily_roi_percent, duration_days, description,
          is_active, color, features
        ) VALUES (
          ${pkg.id}, ${pkg.name}, ${pkg.tag || null}, ${pkg.priceKES}, ${pkg.dailyRoiPercent},
          ${pkg.durationDays}, ${pkg.description}, ${pkg.isActive}, ${pkg.color}, ${JSON.stringify(pkg.features)}
        ) ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          tag = EXCLUDED.tag,
          price_kes = EXCLUDED.price_kes,
          daily_roi_percent = EXCLUDED.daily_roi_percent,
          duration_days = EXCLUDED.duration_days,
          description = EXCLUDED.description,
          is_active = EXCLUDED.is_active,
          color = EXCLUDED.color,
          features = EXCLUDED.features,
          updated_at = CURRENT_TIMESTAMP;
      `;
      console.log(`[Neon DB] Saved investment package ${pkg.id} to Neon Postgres.`);
    } catch (err) {
      console.warn('[Neon DB] createInvestmentPackage failed:', err);
    }
  }

  const idx = memoryPackages.findIndex(p => p.id === pkg.id);
  if (idx !== -1) {
    memoryPackages[idx] = pkg;
  } else {
    memoryPackages.push(pkg);
  }
  return pkg;
}

export async function updateInvestmentPackage(id: string, updates: Partial<InvestmentPackage>): Promise<InvestmentPackage | null> {
  const existing = (await getAllPackages()).find(p => p.id === id);
  if (!existing) return null;

  const merged: InvestmentPackage = {
    ...existing,
    ...updates,
  };

  await createInvestmentPackage(merged);
  return merged;
}

export async function deleteInvestmentPackage(id: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`DELETE FROM investment_packages WHERE id = ${id};`;
    } catch (err) {
      console.warn('[Neon DB] deleteInvestmentPackage failed:', err);
    }
  }
  memoryPackages = memoryPackages.filter(p => p.id !== id);
  return true;
}

export async function resetInvestmentPackages(): Promise<InvestmentPackage[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`DELETE FROM investment_packages;`;
      for (const p of defaultPackages) {
        await sql`
          INSERT INTO investment_packages (
            id, name, tag, price_kes, daily_roi_percent, duration_days, description,
            is_active, color, features
          ) VALUES (
            ${p.id}, ${p.name}, ${p.tag || null}, ${p.priceKES}, ${p.dailyRoiPercent},
            ${p.durationDays}, ${p.description}, ${p.isActive}, ${p.color}, ${JSON.stringify(p.features)}
          );
        `;
      }
    } catch (err) {
      console.warn('[Neon DB] resetInvestmentPackages failed:', err);
    }
  }
  memoryPackages = JSON.parse(JSON.stringify(defaultPackages));
  return memoryPackages;
}

// ----------------------------------------------------
// USER INVESTMENTS CRUD
// ----------------------------------------------------
export async function getUserInvestments(userId: string): Promise<ActiveInvestment[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, package_id as "packageId", package_name as "packageName",
          amount_kes as "amountKES", daily_roi_percent as "dailyRoiPercent",
          daily_return_kes as "dailyReturnKES", duration_days as "durationDays",
          days_elapsed as "daysElapsed", total_earned_kes as "totalEarnedKES",
          unclaimed_yield_kes as "unclaimedYieldKES", start_date as "startDate",
          last_claim_date as "lastClaimDate", status
        FROM user_investments
        WHERE user_id = ${userId} OR user_id = 'usr-98214'
        ORDER BY created_at DESC;
      `;
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.id,
          packageId: r.packageId,
          packageName: r.packageName,
          amountKES: Number(r.amountKES),
          dailyRoiPercent: Number(r.dailyRoiPercent),
          dailyReturnKES: Number(r.dailyReturnKES),
          durationDays: Number(r.durationDays),
          daysElapsed: Number(r.daysElapsed),
          totalEarnedKES: Number(r.totalEarnedKES),
          unclaimedYieldKES: Number(r.unclaimedYieldKES),
          startDate: r.startDate,
          lastClaimDate: r.lastClaimDate || r.startDate,
          status: r.status as 'active' | 'completed',
        }));
      }
    } catch (err) {
      console.warn('[Neon DB] getUserInvestments failed:', err);
    }
  }

  return memoryInvestments;
}

export async function createInvestment(userId: string, inv: ActiveInvestment): Promise<ActiveInvestment> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO user_investments (
          id, user_id, package_id, package_name, amount_kes, daily_roi_percent,
          daily_return_kes, duration_days, days_elapsed, total_earned_kes, unclaimed_yield_kes,
          start_date, last_claim_date, status
        ) VALUES (
          ${inv.id}, ${userId}, ${inv.packageId}, ${inv.packageName}, ${inv.amountKES},
          ${inv.dailyRoiPercent}, ${inv.dailyReturnKES}, ${inv.durationDays}, ${inv.daysElapsed},
          ${inv.totalEarnedKES}, ${inv.unclaimedYieldKES}, ${inv.startDate}, ${inv.lastClaimDate}, ${inv.status}
        );
      `;
      console.log(`[Neon DB] Saved active investment ${inv.id} for user ${userId} in Neon.`);
    } catch (err) {
      console.warn('[Neon DB] createInvestment failed:', err);
    }
  }

  memoryInvestments.unshift(inv);
  return inv;
}

// ----------------------------------------------------
// TRANSACTIONS CRUD
// ----------------------------------------------------
export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, type, amount_kes as "amountKES", status, date_str as "date",
          description, reference_code as "reference", destination
        FROM transactions
        WHERE user_id = ${userId} OR user_id = 'usr-98214'
        ORDER BY created_at DESC;
      `;
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.id,
          type: r.type as Transaction['type'],
          amountKES: Number(r.amountKES),
          status: r.status as Transaction['status'],
          date: r.date,
          description: r.description,
          reference: r.reference || '',
          destination: r.destination || undefined,
        }));
      }
    } catch (err) {
      console.warn('[Neon DB] getUserTransactions failed:', err);
    }
  }

  return memoryTransactions;
}

export async function createTransaction(userId: string, tx: Transaction): Promise<Transaction> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO transactions (
          id, user_id, type, amount_kes, status, date_str, description, reference_code, destination
        ) VALUES (
          ${tx.id}, ${userId}, ${tx.type}, ${tx.amountKES}, ${tx.status}, ${tx.date},
          ${tx.description}, ${tx.reference}, ${tx.destination || null}
        );
      `;
      console.log(`[Neon DB] Recorded transaction ${tx.id} for user ${userId} in Neon.`);
    } catch (err) {
      console.warn('[Neon DB] createTransaction failed:', err);
    }
  }

  memoryTransactions.unshift(tx);
  return tx;
}

// ----------------------------------------------------
// WITHDRAWALS CRUD
// ----------------------------------------------------
export async function getUserWithdrawals(userId?: string): Promise<WithdrawalRequest[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = userId
        ? await sql`
            SELECT 
              id, user_id as "userId", user_name as "userName", amount_kes as "amountKES",
              fee_kes as "feeKES", net_amount_kes as "netAmountKES", method, destination,
              account_name as "accountName", status, estimated_delivery as "estimatedDelivery",
              tx_hash_or_ref as "txHashOrRef", created_at_str as "createdAt"
            FROM withdrawals
            WHERE user_id = ${userId} OR user_id = 'usr-98214'
            ORDER BY created_at DESC;
          `
        : await sql`
            SELECT 
              id, user_id as "userId", user_name as "userName", amount_kes as "amountKES",
              fee_kes as "feeKES", net_amount_kes as "netAmountKES", method, destination,
              account_name as "accountName", status, estimated_delivery as "estimatedDelivery",
              tx_hash_or_ref as "txHashOrRef", created_at_str as "createdAt"
            FROM withdrawals
            ORDER BY created_at DESC;
          `;
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.id,
          userId: r.userId,
          userName: r.userName,
          amountKES: Number(r.amountKES),
          feeKES: Number(r.feeKES || 0),
          netAmountKES: Number(r.netAmountKES),
          method: r.method as WithdrawalRequest['method'],
          destination: r.destination,
          accountName: r.accountName || undefined,
          status: r.status as WithdrawalRequest['status'],
          estimatedDelivery: r.estimatedDelivery || '',
          txHashOrRef: r.txHashOrRef || '',
          createdAt: r.createdAt,
        }));
      }
    } catch (err) {
      console.warn('[Neon DB] getUserWithdrawals failed:', err);
    }
  }

  return userId ? memoryWithdrawals.filter(w => w.userId === userId) : memoryWithdrawals;
}

export async function createWithdrawal(w: WithdrawalRequest): Promise<WithdrawalRequest> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO withdrawals (
          id, user_id, user_name, amount_kes, fee_kes, net_amount_kes, method,
          destination, account_name, status, estimated_delivery, tx_hash_or_ref, created_at_str
        ) VALUES (
          ${w.id}, ${w.userId}, ${w.userName}, ${w.amountKES}, ${w.feeKES}, ${w.netAmountKES},
          ${w.method}, ${w.destination}, ${w.accountName || null}, ${w.status},
          ${w.estimatedDelivery}, ${w.txHashOrRef}, ${w.createdAt}
        );
      `;
      console.log(`[Neon DB] Saved withdrawal ${w.id} to Neon.`);
    } catch (err) {
      console.warn('[Neon DB] createWithdrawal failed:', err);
    }
  }

  memoryWithdrawals.unshift(w);
  return w;
}

export async function updateWithdrawalStatus(
  id: string, 
  status: WithdrawalRequest['status'], 
  txRef?: string,
  rejectionReason?: string
): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      if (txRef) {
        await sql`UPDATE withdrawals SET status = ${status}, tx_hash_or_ref = ${txRef} WHERE id = ${id};`;
      } else {
        await sql`UPDATE withdrawals SET status = ${status} WHERE id = ${id};`;
      }
    } catch (err) {
      console.warn('[Neon DB] updateWithdrawalStatus failed:', err);
    }
  }

  const found = memoryWithdrawals.find(w => w.id === id);
  if (found) {
    found.status = status;
    if (txRef) found.txHashOrRef = txRef;
    if (rejectionReason) found.rejectionReason = rejectionReason;
    return true;
  }
  return false;
}

// ----------------------------------------------------
// REFERRALS CRUD
// ----------------------------------------------------
export async function getUserReferrals(referrerId?: string): Promise<ReferralMember[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = referrerId
        ? await sql`
            SELECT 
              id, name, phone_or_email as "phoneOrEmail", tier, referred_by as "referredBy",
              joined_date as "joinedDate", total_deposited_kes as "totalDepositedKES",
              commission_earned_kes as "commissionEarnedKES", package_active as "packageActive",
              status
            FROM referrals
            WHERE referrer_id = ${referrerId} OR referrer_id = 'usr-98214'
            ORDER BY joined_date DESC;
          `
        : await sql`
            SELECT 
              id, name, phone_or_email as "phoneOrEmail", tier, referred_by as "referredBy",
              joined_date as "joinedDate", total_deposited_kes as "totalDepositedKES",
              commission_earned_kes as "commissionEarnedKES", package_active as "packageActive",
              status
            FROM referrals
            ORDER BY joined_date DESC;
          `;
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.id,
          name: r.name,
          phoneOrEmail: r.phoneOrEmail,
          tier: Number(r.tier) as 1 | 2 | 3,
          referredBy: r.referredBy,
          joinedDate: r.joinedDate,
          totalDepositedKES: Number(r.totalDepositedKES),
          commissionEarnedKES: Number(r.commissionEarnedKES),
          packageActive: r.packageActive || '',
          status: r.status as 'active' | 'inactive',
        }));
      }
    } catch (err) {
      console.warn('[Neon DB] getUserReferrals failed:', err);
    }
  }

  return memoryReferrals;
}

// ----------------------------------------------------
// CHAT THREADS & MESSAGES CRUD
// ----------------------------------------------------
export async function getChatThreads(): Promise<ChatThread[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const threadsRes = await sql`
        SELECT 
          id, user_id as "userId", user_name as "userName", user_phone as "userPhone",
          user_email as "userEmail", user_referral_code as "userReferralCode",
          status, unread_count_user as "unreadCountUser", unread_count_admin as "unreadCountAdmin",
          last_message_time as "lastMessageTime", last_message_snippet as "lastMessageSnippet"
        FROM chat_threads
        ORDER BY updated_at DESC;
      `;

      if (threadsRes && threadsRes.length > 0) {
        const fullThreads: ChatThread[] = [];
        for (const t of threadsRes) {
          const msgsRes = await sql`
            SELECT 
              id, thread_id as "threadId", sender, sender_name as "senderName",
              text, timestamp_str as "timestamp", is_read as "isRead",
              voice_note as "voiceNote", attachment
            FROM chat_messages
            WHERE thread_id = ${t.id}
            ORDER BY created_at ASC;
          `;
          fullThreads.push({
            id: t.id,
            userId: t.userId,
            userName: t.userName,
            userPhone: t.userPhone || '',
            userEmail: t.userEmail || '',
            userReferralCode: t.userReferralCode || '',
            status: t.status as ChatThread['status'],
            unreadCountUser: Number(t.unreadCountUser || 0),
            unreadCountAdmin: Number(t.unreadCountAdmin || 0),
            lastMessageTime: t.lastMessageTime || '',
            lastMessageSnippet: t.lastMessageSnippet || '',
            messages: msgsRes.map(m => ({
              id: m.id,
              threadId: m.threadId,
              sender: m.sender as ChatMessage['sender'],
              senderName: m.senderName,
              text: m.text || undefined,
              timestamp: m.timestamp,
              isRead: Boolean(m.isRead),
              voiceNote: m.voiceNote ? (typeof m.voiceNote === 'string' ? JSON.parse(m.voiceNote) : m.voiceNote) : undefined,
              attachment: m.attachment ? (typeof m.attachment === 'string' ? JSON.parse(m.attachment) : m.attachment) : undefined,
            })),
          });
        }
        return fullThreads;
      }
    } catch (err) {
      console.warn('[Neon DB] getChatThreads query failed:', err);
    }
  }

  return memoryThreads;
}

export async function getChatThreadByUserId(userId: string, defaultName = 'Royal Member'): Promise<ChatThread> {
  const threads = await getChatThreads();
  const found = threads.find(t => t.userId === userId);
  if (found) return found;

  const newThread: ChatThread = {
    id: `thread-${userId}`,
    userId,
    userName: defaultName,
    userPhone: '+254 700 000 000',
    userEmail: 'member@royalservice.ke',
    userReferralCode: 'ROYAL-VIP',
    status: 'active',
    unreadCountUser: 1,
    unreadCountAdmin: 0,
    lastMessageTime: 'Just now',
    lastMessageSnippet: 'Welcome to Royal Service Concierge VIP Support',
    messages: [
      {
        id: `msg-welcome-${Date.now()}`,
        threadId: `thread-${userId}`,
        sender: 'system',
        senderName: 'Royal Concierge System',
        text: 'Private encrypted VIP communication established.',
        timestamp: 'Just now',
        isRead: true,
      },
      {
        id: `msg-welcome-admin-${Date.now()}`,
        threadId: `thread-${userId}`,
        sender: 'admin',
        senderName: 'VIP Support Manager (Assigned #VIP-402)',
        text: 'Hello! Welcome to Royal Service. How can we assist you today regarding your daily yields, M-Pesa deposits, or Binance Pay settlements?',
        timestamp: 'Just now',
        isRead: false,
      },
    ],
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO chat_threads (
          id, user_id, user_name, user_phone, user_email, user_referral_code,
          status, unread_count_user, unread_count_admin, last_message_time, last_message_snippet
        ) VALUES (
          ${newThread.id}, ${newThread.userId}, ${newThread.userName}, ${newThread.userPhone},
          ${newThread.userEmail}, ${newThread.userReferralCode}, ${newThread.status},
          ${newThread.unreadCountUser}, ${newThread.unreadCountAdmin}, ${newThread.lastMessageTime},
          ${newThread.lastMessageSnippet}
        ) ON CONFLICT (id) DO NOTHING;
      `;
      for (const m of newThread.messages) {
        await sql`
          INSERT INTO chat_messages (
            id, thread_id, sender, sender_name, text, timestamp_str, is_read
          ) VALUES (
            ${m.id}, ${newThread.id}, ${m.sender}, ${m.senderName}, ${m.text || null},
            ${m.timestamp}, ${m.isRead}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
    } catch (err) {
      console.warn('[Neon DB] getChatThreadByUserId insert failed:', err);
    }
  }

  memoryThreads.unshift(newThread);
  return newThread;
}

export async function addChatMessageToDb(
  threadId: string, 
  msg: ChatMessage,
  snippet: string,
  incrementUserUnread: boolean,
  incrementAdminUnread: boolean
): Promise<void> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO chat_messages (
          id, thread_id, sender, sender_name, text, timestamp_str, is_read, voice_note, attachment
        ) VALUES (
          ${msg.id}, ${threadId}, ${msg.sender}, ${msg.senderName}, ${msg.text || null},
          ${msg.timestamp}, ${msg.isRead}, 
          ${msg.voiceNote ? JSON.stringify(msg.voiceNote) : null},
          ${msg.attachment ? JSON.stringify(msg.attachment) : null}
        );
      `;
      if (incrementUserUnread) {
        await sql`
          UPDATE chat_threads 
          SET last_message_time = ${msg.timestamp}, 
              last_message_snippet = ${snippet},
              unread_count_user = unread_count_user + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${threadId};
        `;
      } else if (incrementAdminUnread) {
        await sql`
          UPDATE chat_threads 
          SET last_message_time = ${msg.timestamp}, 
              last_message_snippet = ${snippet},
              unread_count_admin = unread_count_admin + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${threadId};
        `;
      } else {
        await sql`
          UPDATE chat_threads 
          SET last_message_time = ${msg.timestamp}, 
              last_message_snippet = ${snippet},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${threadId};
        `;
      }
    } catch (err) {
      console.warn('[Neon DB] addChatMessageToDb failed:', err);
    }
  }

  const th = memoryThreads.find(t => t.id === threadId);
  if (th) {
    th.messages.push(msg);
    th.lastMessageTime = msg.timestamp;
    th.lastMessageSnippet = snippet;
    if (incrementUserUnread) th.unreadCountUser += 1;
    if (incrementAdminUnread) th.unreadCountAdmin += 1;
  }
}

// ----------------------------------------------------
// PLATFORM SETTINGS CRUD
// ----------------------------------------------------
export async function getPlatformSettings(): Promise<PlatformSettings> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          min_withdrawal_kes as "minWithdrawalKES",
          mpesa_estimated_hours as "mpesaEstimatedHours",
          binance_instant_enabled as "binanceInstantEnabled",
          tier1_commission_percent as "tier1CommissionPercent",
          tier2_commission_percent as "tier2CommissionPercent",
          tier3_commission_percent as "tier3CommissionPercent",
          usdt_to_kes_exchange_rate as "usdtToKesExchangeRate",
          platform_status as "platformStatus",
          mpesa_withdrawal_fee_percent as "mpesaWithdrawalFeePercent",
          binance_withdrawal_fee_percent as "binanceWithdrawalFeePercent",
          anti_fraud_enabled as "antiFraudEnabled",
          max_daily_withdrawal_kes as "maxDailyWithdrawalKES",
          withdrawal_cooldown_hours as "withdrawalCooldownHours",
          strict_phone_match_enabled as "strictPhoneMatchEnabled",
          auto_freeze_high_risk as "autoFreezeHighRisk"
        FROM platform_settings
        LIMIT 1;
      `;
      if (rows && rows.length > 0) {
        const r = rows[0];
        return {
          minWithdrawalKES: Number(r.minWithdrawalKES),
          mpesaEstimatedHours: Number(r.mpesaEstimatedHours),
          binanceInstantEnabled: Boolean(r.binanceInstantEnabled),
          tier1CommissionPercent: Number(r.tier1CommissionPercent),
          tier2CommissionPercent: Number(r.tier2CommissionPercent),
          tier3CommissionPercent: Number(r.tier3CommissionPercent),
          usdtToKesExchangeRate: Number(r.usdtToKesExchangeRate),
          platformStatus: r.platformStatus as 'active' | 'maintenance',
          mpesaWithdrawalFeePercent: Number(r.mpesaWithdrawalFeePercent),
          binanceWithdrawalFeePercent: Number(r.binanceWithdrawalFeePercent),
          antiFraudEnabled: r.antiFraudEnabled !== false,
          maxDailyWithdrawalKES: Number(r.maxDailyWithdrawalKES || 50000),
          withdrawalCooldownHours: Number(r.withdrawalCooldownHours || 24),
          strictPhoneMatchEnabled: r.strictPhoneMatchEnabled !== false,
          autoFreezeHighRisk: r.autoFreezeHighRisk !== false,
        };
      }
    } catch (err) {
      console.warn('[Neon DB] getPlatformSettings failed:', err);
    }
  }

  return memorySettings;
}

export async function updatePlatformSettingsInDb(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
  const existing = await getPlatformSettings();
  const merged: PlatformSettings = { ...existing, ...updates };

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE platform_settings SET
          min_withdrawal_kes = ${merged.minWithdrawalKES},
          mpesa_estimated_hours = ${merged.mpesaEstimatedHours},
          binance_instant_enabled = ${merged.binanceInstantEnabled},
          tier1_commission_percent = ${merged.tier1CommissionPercent},
          tier2_commission_percent = ${merged.tier2CommissionPercent},
          tier3_commission_percent = ${merged.tier3CommissionPercent},
          usdt_to_kes_exchange_rate = ${merged.usdtToKesExchangeRate},
          platform_status = ${merged.platformStatus},
          mpesa_withdrawal_fee_percent = ${merged.mpesaWithdrawalFeePercent},
          binance_withdrawal_fee_percent = ${merged.binanceWithdrawalFeePercent},
          anti_fraud_enabled = ${merged.antiFraudEnabled !== false},
          max_daily_withdrawal_kes = ${merged.maxDailyWithdrawalKES || 50000},
          withdrawal_cooldown_hours = ${merged.withdrawalCooldownHours || 24},
          strict_phone_match_enabled = ${merged.strictPhoneMatchEnabled !== false},
          auto_freeze_high_risk = ${merged.autoFreezeHighRisk !== false},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 'default';
      `;
    } catch (err) {
      console.warn('[Neon DB] updatePlatformSettingsInDb failed:', err);
    }
  }

  memorySettings = merged;
  return merged;
}

// ----------------------------------------------------
// ANTI-FRAUD & RISK SHIELD OPERATIONS
// ----------------------------------------------------
let memoryAntiFraudEvents: AntiFraudEvent[] = [
  {
    id: 'afe-seed-1',
    eventType: 'REPLAY_ATTACK_PREVENTED',
    userId: 'usr-guest-99',
    userIdentifier: '+254 799 112 334',
    riskScore: 85,
    severity: 'high',
    actionTaken: 'BLOCKED',
    details: 'Prevented duplicate processing of duplicate M-Pesa receipt QKD78192X.',
    ipAddress: '102.219.208.12',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'afe-seed-2',
    eventType: 'SELF_REFERRAL_ATTEMPT',
    userId: 'usr-10022',
    userIdentifier: 'ken.omondi@gmail.com',
    riskScore: 75,
    severity: 'high',
    actionTaken: 'BLOCKED',
    details: 'User attempted to register secondary account using own referral code ROYAL-KEN99 and matching device profile.',
    ipAddress: '197.237.144.50',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'afe-seed-3',
    eventType: 'SUSPICIOUS_WITHDRAWAL',
    userId: 'usr-98214',
    userIdentifier: 'Jane Wanjiku',
    riskScore: 35,
    severity: 'medium',
    actionTaken: 'FLAGGED_FOR_REVIEW',
    details: 'First-time M-Pesa payout destination (+254 700 998 877) differed from profile phone (+254 712 345 678).',
    ipAddress: '41.90.180.20',
    createdAt: new Date(Date.now() - 3600000 * 32).toISOString(),
  },
];

export async function logAntiFraudEvent(event: AntiFraudEvent): Promise<AntiFraudEvent> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO anti_fraud_events (
          id, event_type, user_id, user_identifier, risk_score, severity, action_taken, details, ip_address, created_at
        ) VALUES (
          ${event.id}, ${event.eventType}, ${event.userId || null}, ${event.userIdentifier || null},
          ${event.riskScore}, ${event.severity}, ${event.actionTaken}, ${event.details},
          ${event.ipAddress || null}, ${event.createdAt}
        );
      `;
      console.log(`[Anti-Fraud DB] Logged ${event.eventType} event: ${event.actionTaken} (Risk: ${event.riskScore})`);
    } catch (err) {
      console.warn('[Neon DB] logAntiFraudEvent failed:', err);
    }
  }
  memoryAntiFraudEvents.unshift(event);
  return event;
}

export async function getAntiFraudEvents(limit: number = 50): Promise<AntiFraudEvent[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          id, event_type as "eventType", user_id as "userId", user_identifier as "userIdentifier",
          risk_score as "riskScore", severity, action_taken as "actionTaken", details,
          ip_address as "ipAddress", created_at as "createdAt"
        FROM anti_fraud_events
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.id,
          eventType: r.eventType as AntiFraudEvent['eventType'],
          userId: r.userId || undefined,
          userIdentifier: r.userIdentifier || undefined,
          riskScore: Number(r.riskScore || 0),
          severity: r.severity as AntiFraudEvent['severity'],
          actionTaken: r.actionTaken as AntiFraudEvent['actionTaken'],
          details: r.details || '',
          ipAddress: r.ipAddress || undefined,
          createdAt: String(r.createdAt),
        }));
      }
    } catch (err) {
      console.warn('[Neon DB] getAntiFraudEvents failed:', err);
    }
  }
  return memoryAntiFraudEvents.slice(0, limit);
}

export async function freezeUserAccount(userId: string, reason: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE users 
        SET is_frozen = TRUE, 
            freeze_reason = ${reason},
            risk_score = GREATEST(risk_score, 85)
        WHERE id = ${userId};
      `;
    } catch (err) {
      console.warn('[Neon DB] freezeUserAccount failed:', err);
    }
  }
  const memUser = memoryUsers.find(u => u.id === userId);
  if (memUser) {
    memUser.isFrozen = true;
    memUser.freezeReason = reason;
    memUser.riskScore = Math.max(memUser.riskScore || 0, 85);
  }

  // Log event
  await logAntiFraudEvent({
    id: `afe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    eventType: 'ACCOUNT_FROZEN',
    userId,
    userIdentifier: memUser?.name || userId,
    riskScore: 90,
    severity: 'critical',
    actionTaken: 'ACCOUNT_AUTO_FROZEN',
    details: `Account frozen by security protocol or admin: ${reason}`,
    createdAt: new Date().toISOString(),
  });

  return true;
}

export async function unfreezeUserAccount(userId: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE users 
        SET is_frozen = FALSE, 
            freeze_reason = NULL,
            risk_score = 0
        WHERE id = ${userId};
      `;
    } catch (err) {
      console.warn('[Neon DB] unfreezeUserAccount failed:', err);
    }
  }
  const memUser = memoryUsers.find(u => u.id === userId);
  if (memUser) {
    memUser.isFrozen = false;
    memUser.freezeReason = undefined;
    memUser.riskScore = 0;
  }

  // Log event
  await logAntiFraudEvent({
    id: `afe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    eventType: 'ACCOUNT_UNFROZEN',
    userId,
    userIdentifier: memUser?.name || userId,
    riskScore: 0,
    severity: 'low',
    actionTaken: 'RESOLVED',
    details: 'Account unlocked and risk score cleared by security audit.',
    createdAt: new Date().toISOString(),
  });

  return true;
}

export async function getAntiFraudMetrics(): Promise<AntiFraudMetrics> {
  const settings = await getPlatformSettings();
  const sql = getNeonSql();
  let blockedCount = 0;
  let flaggedCount = 0;
  let frozenCount = 0;
  let highRiskWithdrawals = 0;
  let kycPending = 0;

  if (sql) {
    try {
      const [bRes, fRes, frzRes, wRes, kycRes] = await Promise.all([
        sql`SELECT count(*) as count FROM anti_fraud_events WHERE action_taken = 'BLOCKED' OR action_taken = 'ACCOUNT_AUTO_FROZEN';`.catch(() => [{ count: 0 }]),
        sql`SELECT count(*) as count FROM users WHERE risk_score > 30;`.catch(() => [{ count: 0 }]),
        sql`SELECT count(*) as count FROM users WHERE is_frozen = TRUE;`.catch(() => [{ count: 0 }]),
        sql`SELECT count(*) as count FROM withdrawals WHERE status = 'pending' AND amount_kes >= 10000;`.catch(() => [{ count: 0 }]),
        sql`SELECT count(*) as count FROM users WHERE kyc_status = 'SUBMITTED';`.catch(() => [{ count: 0 }]),
      ]);
      blockedCount = Number(bRes[0]?.count || 0);
      flaggedCount = Number(fRes[0]?.count || 0);
      frozenCount = Number(frzRes[0]?.count || 0);
      highRiskWithdrawals = Number(wRes[0]?.count || 0);
      kycPending = Number(kycRes[0]?.count || 0);
    } catch (err) {
      console.warn('[Neon DB] getAntiFraudMetrics count failed:', err);
    }
  }

  if (blockedCount === 0) {
    blockedCount = memoryAntiFraudEvents.filter(e => e.actionTaken === 'BLOCKED' || e.actionTaken === 'ACCOUNT_AUTO_FROZEN').length;
  }
  if (flaggedCount === 0) {
    flaggedCount = memoryUsers.filter(u => (u.riskScore || 0) > 30).length;
  }
  if (frozenCount === 0) {
    frozenCount = memoryUsers.filter(u => u.isFrozen).length;
  }

  return {
    totalBlockedExploits: blockedCount,
    flaggedAccountsCount: flaggedCount,
    frozenAccountsCount: frozenCount,
    highRiskWithdrawalsCount: highRiskWithdrawals,
    kycPendingCount: kycPending,
    kycRequiredForHighRisk: settings.kycRequiredForHighRisk !== false,
    kycRiskScoreThreshold: settings.kycRiskScoreThreshold || 60,
    antiFraudEnabled: settings.antiFraudEnabled !== false,
    maxDailyWithdrawalKES: settings.maxDailyWithdrawalKES || 50000,
    withdrawalCooldownHours: settings.withdrawalCooldownHours || 24,
    strictPhoneMatchEnabled: settings.strictPhoneMatchEnabled !== false,
    autoFreezeHighRisk: settings.autoFreezeHighRisk !== false,
  };
}
