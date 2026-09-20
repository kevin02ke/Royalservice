import { 
  InvestmentPackage, 
  ActiveInvestment, 
  Transaction, 
  WithdrawalRequest, 
  ReferralMember, 
  PlatformSettings,
  UserProfile 
} from '../types';

export interface CreatePackagePayload {
  name: string;
  priceKES: number;
  dailyRoiPercent: number;
  durationDays: number;
  tag?: string;
  description?: string;
  isActive?: boolean;
  color?: string;
  features?: string[];
}

export interface UpdatePackagePayload extends Partial<CreatePackagePayload> {
  id: string;
}

export interface NeonDbStatus {
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
}

export const packagesApi = {
  async getAll(): Promise<InvestmentPackage[]> {
    const res = await fetch('/api/packages');
    if (!res.ok) throw new Error(`Failed to fetch packages: HTTP ${res.status}`);
    return res.json();
  },

  async getById(id: string): Promise<InvestmentPackage> {
    const res = await fetch(`/api/packages/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Package ${id} not found: HTTP ${res.status}`);
    return res.json();
  },

  async create(payload: CreatePackagePayload): Promise<InvestmentPackage> {
    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create package: HTTP ${res.status}`);
    }
    return res.json();
  },

  async update(id: string, payload: Partial<CreatePackagePayload>): Promise<InvestmentPackage> {
    const res = await fetch(`/api/packages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update package: HTTP ${res.status}`);
    }
    return res.json();
  },

  async delete(id: string): Promise<{ success: boolean; message: string; deletedId: string }> {
    const res = await fetch(`/api/packages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete package: HTTP ${res.status}`);
    }
    return res.json();
  },

  async reset(): Promise<InvestmentPackage[]> {
    const res = await fetch('/api/packages/reset', { method: 'POST' });
    if (!res.ok) throw new Error(`Failed to reset packages: HTTP ${res.status}`);
    const data = await res.json();
    return data.packages;
  },

  async checkHealth(): Promise<{ status: string; service: string; packageCount: number }> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('API server unreachable');
    return res.json();
  },
};

export const investmentsApi = {
  async getAll(userId = 'usr-98214'): Promise<ActiveInvestment[]> {
    const res = await fetch(`/api/investments?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch investments');
    return res.json();
  },

  async activate(payload: {
    userId: string;
    investment: ActiveInvestment;
    transaction: Transaction;
    userUpdates?: Partial<UserProfile>;
  }): Promise<{ success: boolean; investment: ActiveInvestment }> {
    const res = await fetch('/api/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to activate investment contract');
    }
    return res.json();
  },
};

export const transactionsApi = {
  async getAll(userId = 'usr-98214'): Promise<Transaction[]> {
    const res = await fetch(`/api/transactions?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async record(payload: {
    userId: string;
    transaction: Transaction;
    userUpdates?: Partial<UserProfile>;
  }): Promise<{ success: boolean; transaction: Transaction }> {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to record transaction');
    }
    return res.json();
  },
};

export const withdrawalsApi = {
  async getAll(userId?: string): Promise<WithdrawalRequest[]> {
    const url = userId ? `/api/withdrawals?userId=${encodeURIComponent(userId)}` : '/api/withdrawals';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch withdrawals');
    return res.json();
  },

  async create(payload: {
    withdrawal: WithdrawalRequest;
    transaction: Transaction;
    userUpdates?: Partial<UserProfile>;
  }): Promise<{ success: boolean; withdrawal: WithdrawalRequest }> {
    const res = await fetch('/api/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit withdrawal');
    }
    return res.json();
  },

  async updateStatus(
    id: string, 
    status: WithdrawalRequest['status'], 
    txHashOrRef?: string,
    rejectionReason?: string
  ): Promise<void> {
    const res = await fetch(`/api/withdrawals/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, txHashOrRef, rejectionReason }),
    });
    if (!res.ok) throw new Error('Failed to update withdrawal status');
  },
};

export const referralsApi = {
  async getAll(referrerId = 'usr-98214'): Promise<ReferralMember[]> {
    const res = await fetch(`/api/referrals?referrerId=${encodeURIComponent(referrerId)}`);
    if (!res.ok) throw new Error('Failed to fetch referrals');
    return res.json();
  },
};

export const settingsApi = {
  async get(): Promise<PlatformSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async update(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },
};

export const neonApi = {
  async getStatus(): Promise<NeonDbStatus> {
    const res = await fetch('/api/neon/status');
    if (!res.ok) {
      return {
        isNeonConnected: false,
        projectId: 'ep-little-hall-b5o6vcsm',
        databaseUrlConfigured: false,
        counts: {
          users: 0,
          packages: 0,
          investments: 0,
          transactions: 0,
          withdrawals: 0,
          referrals: 0,
          chatThreads: 0,
          chatMessages: 0,
        },
      };
    }
    return res.json();
  },

  async sync(): Promise<{ success: boolean; status: NeonDbStatus }> {
    const res = await fetch('/api/neon/sync', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to sync Neon database');
    return res.json();
  },
};
