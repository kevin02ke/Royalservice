import { BinancePayOrderResponse } from './binancePayService';

export const binancePayApi = {
  /**
   * Creates a Binance Pay checkout order
   */
  createOrder: async (params: {
    userId: string;
    amountKES: number;
    usdtToKesRate?: number;
    callbackUrl?: string;
  }): Promise<BinancePayOrderResponse> => {
    const res = await fetch('/api/binance/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Failed to create Binance Pay order');
    }

    return res.json();
  },

  /**
   * Polls backend for Binance Pay order status
   */
  checkStatus: async (merchantTradeNo: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    amountKES?: number;
    reference?: string;
  }> => {
    const res = await fetch(`/api/binance/order-status/${encodeURIComponent(merchantTradeNo)}`);
    if (!res.ok) {
      return { status: 'pending' };
    }
    return res.json();
  },

  /**
   * Gets Binance Pay gateway status for Admin
   */
  getConfig: async (): Promise<{
    isLiveConfigured: boolean;
    mode: string;
    merchantId: string;
    webhookUrl: string;
  }> => {
    const res = await fetch('/api/binance/config');
    if (!res.ok) throw new Error('Failed to fetch Binance Pay configuration');
    return res.json();
  },
};
