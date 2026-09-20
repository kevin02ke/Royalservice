import { PayHeroInitiateResponse } from '../types';

export const payheroApi = {
  /**
   * Triggers an M-Pesa STK Push via PayHero Kenya C2B
   */
  async initiateStkPush(params: {
    amount: number;
    phoneNumber: string;
    userId: string;
    channelId?: number | string;
    callbackUrl?: string;
  }): Promise<PayHeroInitiateResponse> {
    const dynamicCallbackUrl = params.callbackUrl || (typeof window !== 'undefined' ? `${window.location.origin}/api/payhero/callback` : undefined);
    const res = await fetch('/api/payhero/stk-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        callbackUrl: dynamicCallbackUrl,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to trigger M-Pesa STK Push');
    }

    return res.json();
  },

  /**
   * Polls the backend to check if the PayHero callback has confirmed the deposit
   */
  async checkStatus(reference: string, externalReference?: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    mpesaReceipt?: string;
    amount?: number;
  }> {
    const query = new URLSearchParams({ reference });
    if (externalReference) query.set('externalReference', externalReference);

    const res = await fetch(`/api/payhero/status?${query.toString()}`);
    if (!res.ok) {
      return { status: 'pending' };
    }
    return res.json();
  },

  /**
   * Gets PayHero gateway configuration status
   */
  async getConfig(): Promise<{
    isLiveConfigured: boolean;
    channelId?: string;
    callbackUrl: string;
    provider: string;
  }> {
    const res = await fetch('/api/payhero/config');
    if (!res.ok) throw new Error('Failed to fetch PayHero config');
    return res.json();
  },
};
