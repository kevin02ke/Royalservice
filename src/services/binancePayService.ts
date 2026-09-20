import crypto from 'crypto';
import { sql } from './neonDb';
import { createTransaction } from './neonDb';

export interface BinancePayOrderParams {
  userId: string;
  amountKES: number;
  usdtToKesRate?: number;
  userEmail?: string;
  callbackUrl?: string;
}

export interface BinancePayOrderResponse {
  success: boolean;
  merchantTradeNo: string;
  prepayId: string;
  orderAmountUSDT: number;
  amountKES: number;
  currency: string;
  checkoutUrl: string;
  qrcodeLink?: string;
  deeplink?: string;
  expireTime?: number;
  message?: string;
}

export interface BinancePayWebhookPayload {
  bizType: string;
  data: string; // JSON string containing merchantTradeNo, orderAmount, currency, etc.
  bizIdStr?: string;
  bizStatus: 'PAY_SUCCESS' | 'PAY_CLOSED' | string;
}

/**
 * Generates HMAC-SHA512 signature for Binance Pay Open API
 * Format: HMAC-SHA512(timestamp + "\n" + nonce + "\n" + payload + "\n", secretKey).toUpperCase()
 */
export function generateBinancePaySignature(
  timestamp: string | number,
  nonce: string,
  payload: string,
  secretKey: string
): string {
  const message = `${timestamp}\n${nonce}\n${payload}\n`;
  return crypto.createHmac('sha512', secretKey).update(message).digest('hex').toUpperCase();
}

/**
 * Resolves Binance Pay credentials from environment variables
 */
export function getBinancePayCredentials() {
  const apiKey = process.env.BINANCE_PAY_API_KEY?.trim() || '';
  const secretKey = process.env.BINANCE_PAY_SECRET_KEY?.trim() || '';
  const merchantId = process.env.BINANCE_PAY_MERCHANT_ID?.trim() || '';
  const isLive = Boolean(apiKey && secretKey);

  return {
    apiKey,
    secretKey,
    merchantId,
    isLive,
    mode: isLive ? 'Live Production' : 'Sandbox / Test Mode Active',
  };
}

/**
 * Creates a Binance Pay checkout order (C2B Deposit)
 */
export async function createBinancePayOrder(params: BinancePayOrderParams): Promise<BinancePayOrderResponse> {
  const { userId, amountKES, usdtToKesRate = 130 } = params;
  const usdtAmount = Number((amountKES / usdtToKesRate).toFixed(2));
  const merchantTradeNo = `BPAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const { apiKey, secretKey, isLive } = getBinancePayCredentials();

  console.log(`[Binance Pay] Creating order for ${userId} - KES ${amountKES} ($${usdtAmount} USDT). Mode: ${isLive ? 'LIVE' : 'TEST'}`);

  // 1. Initial pending transaction record in Neon PostgreSQL
  try {
    await createTransaction(userId, {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amountKES: amountKES,
      description: `Binance Pay USDT Deposit ($${usdtAmount} USDT)`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
      reference: merchantTradeNo,
    });
  } catch (dbErr) {
    console.warn('[Binance Pay] Failed to record initial transaction:', dbErr);
  }

  // 2. Live Binance Pay API call if credentials exist
  if (isLive) {
    try {
      const timestamp = Date.now().toString();
      const nonce = crypto.randomBytes(16).toString('hex');
      const bodyObj = {
        env: {
          terminalType: 'WEB',
        },
        merchantTradeNo,
        orderAmount: usdtAmount,
        currency: 'USDT',
        goods: {
          goodsType: '02',
          goodsCategory: 'Z000',
          referenceGoodsId: 'PORTFOLIO_DEPOSIT',
          goodsName: 'Portfolio Asset Deposit',
          goodsDetail: `Royal Service deposit KES ${amountKES.toLocaleString()} ($${usdtAmount} USDT)`,
        },
        returnUrl: params.callbackUrl || (process.env.APP_URL ? `${process.env.APP_URL}/dashboard` : 'https://binance.com'),
        cancelUrl: params.callbackUrl || (process.env.APP_URL ? `${process.env.APP_URL}/dashboard` : 'https://binance.com'),
      };

      const payloadStr = JSON.stringify(bodyObj);
      const signature = generateBinancePaySignature(timestamp, nonce, payloadStr, secretKey);

      const response = await fetch('https://bpay.binanceapi.com/binancepay/openapi/v2/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'BinancePay-Timestamp': timestamp,
          'BinancePay-Nonce': nonce,
          'BinancePay-Certificate-SN': apiKey,
          'BinancePay-Signature': signature,
        },
        body: payloadStr,
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok || resData.status !== 'SUCCESS') {
        console.error('[Binance Pay API Error]:', response.status, resData);
        throw new Error(resData.errorMessage || `Binance Pay error code: ${resData.code || response.status}`);
      }

      const orderData = resData.data;

      return {
        success: true,
        merchantTradeNo,
        prepayId: orderData.prepayId,
        orderAmountUSDT: usdtAmount,
        amountKES,
        currency: 'USDT',
        checkoutUrl: orderData.checkoutUrl || orderData.universalUrl || `https://pay.binance.com/checkout?prepayId=${orderData.prepayId}`,
        qrcodeLink: orderData.qrcodeLink || orderData.qrContent,
        deeplink: orderData.deeplink,
        expireTime: orderData.expireTime,
        message: 'Binance Pay order created successfully',
      };
    } catch (apiErr: any) {
      console.warn('[Binance Pay Live API Failed]:', apiErr.message);
      throw apiErr;
    }
  }

  // In production, require live Binance Pay credentials
  console.error('[Binance Pay Production] Credentials not configured in environment.');
  throw new Error('Binance Pay credentials not configured. Please configure BINANCE_PAY_API_KEY and BINANCE_PAY_SECRET_KEY in your environment variables.');
}

/**
 * Handles incoming Binance Pay webhook notification
 */
export async function handleBinancePayWebhook(
  payload: BinancePayWebhookPayload,
  headers: { timestamp?: string; nonce?: string; signature?: string }
): Promise<{ returnCode: string; returnMessage: string | null }> {
  console.log('[Binance Pay Webhook Received]:', JSON.stringify(payload, null, 2));

  const { secretKey, isLive } = getBinancePayCredentials();

  // Validate signature in live mode if headers exist
  if (isLive && headers.timestamp && headers.nonce && headers.signature) {
    const calculatedSig = generateBinancePaySignature(
      headers.timestamp,
      headers.nonce,
      JSON.stringify(payload),
      secretKey
    );
    if (calculatedSig.toUpperCase() !== headers.signature.toUpperCase()) {
      console.warn('[Binance Pay Webhook] Signature verification failed');
      return { returnCode: 'FAIL', returnMessage: 'Invalid signature' };
    }
  }

  let orderData: any = {};
  try {
    orderData = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
  } catch (parseErr) {
    console.warn('[Binance Pay Webhook] Failed to parse payload.data:', parseErr);
  }

  const merchantTradeNo = orderData.merchantTradeNo;
  const bizStatus = payload.bizStatus;
  const usdtAmount = Number(orderData.orderAmount || 0);

  if (bizStatus === 'PAY_SUCCESS' && merchantTradeNo) {
    try {
      if (sql) {
        // Find the pending transaction in Neon PostgreSQL
        const txRows = await sql`
          SELECT user_id, amount_kes FROM transactions 
          WHERE reference = ${merchantTradeNo} AND status = 'pending'
          LIMIT 1;
        `;

        if (txRows.length > 0) {
          const userId = txRows[0].user_id;
          const amountKES = Number(txRows[0].amount_kes);

          // Mark transaction completed
          await sql`
            UPDATE transactions 
            SET status = 'completed', 
                description = ${`Binance Pay Confirmed ($${usdtAmount || (amountKES / 130).toFixed(2)} USDT)`}
            WHERE reference = ${merchantTradeNo};
          `;

          // Credit user balance in Neon DB
          const userRows = await sql`
            UPDATE users 
            SET balance_kes = balance_kes + ${amountKES}
            WHERE id = ${userId}
            RETURNING balance_kes;
          `;

          const newBal = userRows[0]?.balance_kes;
          console.log(`[Binance Pay Webhook] Credited KES ${amountKES} ($${usdtAmount} USDT) to user ${userId}. New Balance: KES ${newBal}`);
        } else {
          // If transaction was not found, search by partial reference or credit default demo user
          console.log(`[Binance Pay Webhook] No matching pending transaction for ${merchantTradeNo}, logging completion.`);
        }
      }
    } catch (dbErr) {
      console.error('[Binance Pay Webhook] DB update error:', dbErr);
    }
  }

  return {
    returnCode: 'SUCCESS',
    returnMessage: null,
  };
}

/**
 * Checks order status from Neon DB
 */
export async function checkBinancePayOrderStatus(merchantTradeNo: string): Promise<{
  status: 'pending' | 'completed' | 'failed';
  amountKES?: number;
  reference?: string;
}> {
  try {
    if (sql) {
      const rows = await sql`
        SELECT status, amount_kes, reference FROM transactions 
        WHERE reference = ${merchantTradeNo}
        LIMIT 1;
      `;
      if (rows.length > 0) {
        return {
          status: rows[0].status as any,
          amountKES: Number(rows[0].amount_kes),
          reference: rows[0].reference,
        };
      }
    }
  } catch (err) {
    console.warn('[Binance Pay] Status query error:', err);
  }

  return { status: 'pending' };
}
