import { AntiFraudEvent, AntiFraudMetrics, PlatformSettings, UserProfile } from '../types';

export async function fetchAntiFraudMetrics(): Promise<AntiFraudMetrics> {
  try {
    const res = await fetch('/api/antifraud/metrics');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.metrics;
  } catch (err) {
    console.warn('[Anti-Fraud Service] fetchAntiFraudMetrics failed, using fallback:', err);
    return {
      totalBlockedExploits: 2,
      flaggedAccountsCount: 1,
      frozenAccountsCount: 0,
      highRiskWithdrawalsCount: 0,
      antiFraudEnabled: true,
      maxDailyWithdrawalKES: 50000,
      withdrawalCooldownHours: 24,
      strictPhoneMatchEnabled: true,
      autoFreezeHighRisk: true,
    };
  }
}

export async function fetchAntiFraudEvents(limit: number = 50): Promise<AntiFraudEvent[]> {
  try {
    const res = await fetch(`/api/antifraud/events?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.events || [];
  } catch (err) {
    console.warn('[Anti-Fraud Service] fetchAntiFraudEvents failed, using fallback:', err);
    return [];
  }
}

export async function fetchFlaggedUsers(): Promise<UserProfile[]> {
  try {
    const res = await fetch('/api/antifraud/flagged-users');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.users || [];
  } catch (err) {
    console.warn('[Anti-Fraud Service] fetchFlaggedUsers failed, using fallback:', err);
    return [];
  }
}

export async function freezeAccountApi(userId: string, reason: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/antifraud/user/${encodeURIComponent(userId)}/freeze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message || 'Account frozen' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}

export async function unfreezeAccountApi(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/antifraud/user/${encodeURIComponent(userId)}/unfreeze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return { success: data.success, message: data.message || 'Account restored' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}

export async function updateAntiFraudSettingsApi(
  settings: Partial<PlatformSettings>
): Promise<{ success: boolean; settings?: PlatformSettings; message?: string }> {
  try {
    const res = await fetch('/api/antifraud/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    return { success: data.success, settings: data.settings, message: data.message };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}

export async function toggleUserKycApi(userId: string, force: boolean, reason?: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/antifraud/user/${encodeURIComponent(userId)}/kyc-toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force, reason }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}

export async function approveUserKycApi(userId: string, adminNotes?: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/kyc/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, adminNotes }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}

export async function rejectUserKycApi(userId: string, reason: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/kyc/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}

export async function submitUserKycApi(payload: {
  userId: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  selfieUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/kyc/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { success: data.success, message: data.message };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error' };
  }
}

