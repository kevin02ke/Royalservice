import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowDownCircle, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  QrCode, 
  Loader2, 
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { PlatformSettings, UserProfile } from '../types';
import { payheroApi } from '../services/payheroApi';
import { binancePayApi } from '../services/binancePayApi';
import { BinancePayOrderResponse } from '../services/binancePayService';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  settings: PlatformSettings;
  onDepositSuccess: (amountKES: number, channel: 'mpesa' | 'binance', ref: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onDepositSuccess,
}) => {
  const [method, setMethod] = useState<'mpesa' | 'binance'>('mpesa');
  const [amount, setAmount] = useState<number>(900); // default to silver package price
  const [phone, setPhone] = useState(user.phone);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [stkPromptStep, setStkPromptStep] = useState(false);
  const [binancePromptStep, setBinancePromptStep] = useState(false);
  const [binanceOrder, setBinanceOrder] = useState<BinancePayOrderResponse | null>(null);
  const [txRef, setTxRef] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [externalReference, setExternalReference] = useState('');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stkPromptStep && countdown > 0 && !isSuccess) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stkPromptStep, countdown, isSuccess]);

  // Clean up polling interval when modal closes
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const usdtEquivalent = (amount / settings.usdtToKesExchangeRate).toFixed(2);

  const handleTriggerDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setErrorMessage(null);
    setIsProcessing(true);

    if (method === 'mpesa') {
      try {
        // Initiate real PayHero STK Push
        const res = await payheroApi.initiateStkPush({
          amount,
          phoneNumber: phone,
          userId: user.id,
          channelId: settings.payheroChannelId,
        });

        setExternalReference(res.externalReference);
        setStkPromptStep(true);
        setCountdown(60);

        // Start polling for webhook confirmation from PayHero
        const refToPoll = res.reference || res.externalReference;
        if (pollingRef.current) clearInterval(pollingRef.current);

        pollingRef.current = setInterval(async () => {
          try {
            const statusRes = await payheroApi.checkStatus(refToPoll, res.externalReference);
            if (statusRes.status === 'completed') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              const receipt = statusRes.mpesaReceipt || `MPESA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
              setTxRef(receipt);
              onDepositSuccess(amount, 'mpesa', receipt);
              setIsProcessing(false);
              setStkPromptStep(false);
              setIsSuccess(true);
            } else if (statusRes.status === 'failed') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setIsProcessing(false);
              setStkPromptStep(false);
              setErrorMessage('Payment was declined or canceled on the phone.');
            }
          } catch (pollErr) {
            console.warn('Status poll error:', pollErr);
          }
        }, 2500);

      } catch (err: any) {
        console.error('M-Pesa STK initiation error:', err);
        setIsProcessing(false);
        setErrorMessage(err.message || 'Failed to initiate M-Pesa prompt. Please check your phone number and try again.');
      }
    } else {
      // Binance Pay Instant (USDT Crypto)
      try {
        const order = await binancePayApi.createOrder({
          userId: user.id,
          amountKES: amount,
          usdtToKesRate: settings.usdtToKesExchangeRate,
        });

        setBinanceOrder(order);
        setBinancePromptStep(true);
        setCountdown(120);

        if (pollingRef.current) clearInterval(pollingRef.current);

        pollingRef.current = setInterval(async () => {
          try {
            const statusRes = await binancePayApi.checkStatus(order.merchantTradeNo);
            if (statusRes.status === 'completed') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setTxRef(order.merchantTradeNo);
              onDepositSuccess(amount, 'binance', order.merchantTradeNo);
              setIsProcessing(false);
              setBinancePromptStep(false);
              setIsSuccess(true);
            }
          } catch (pollErr) {
            console.warn('Binance status poll notice:', pollErr);
          }
        }, 3000);
      } catch (err: any) {
        console.error('Binance Pay order creation error:', err);
        setIsProcessing(false);
        setErrorMessage(err.message || 'Failed to create Binance Pay order. Please try again.');
      }
    }
  };

  const handleClose = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setIsSuccess(false);
    setIsProcessing(false);
    setStkPromptStep(false);
    setBinancePromptStep(false);
    setBinanceOrder(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#0d121d] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 z-10 space-y-4 overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: -15 }}
                className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner"
              >
                <ArrowDownCircle className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base tracking-tight">Deposit Funds</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                    ⚡ Instant
                  </span>
                </div>
                <p className="text-xs text-slate-400">Instant Automated Credit • 0% Deposit Fee</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="text-center py-6 space-y-4 relative z-10"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              >
                <CheckCircle2 className="w-9 h-9" />
              </motion.div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">⚡ Instant Deposit Credited!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Successfully credited <strong className="text-emerald-300 font-mono font-bold">KES {amount.toLocaleString()}</strong> ({method === 'binance' ? `$${usdtEquivalent} USDT` : 'via M-Pesa STK'}) directly to your active portfolio balance.
                </p>
              </div>
              <div className="p-3 bg-[#0a0e17] rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
                TxID: {txRef}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              >
                Proceed to Investment Plans
              </motion.button>
            </motion.div>
          ) : isProcessing && stkPromptStep ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-3.5 relative z-10"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border border-slate-900 shadow">
                  {countdown}s
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                  <Zap className="w-3 h-3 fill-emerald-400" />
                  <span>M-Pesa Express Checkout</span>
                </div>
                <h4 className="font-bold text-white text-base">STK Prompt Sent to Handset</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Please unlock your phone <strong className="text-white font-mono">{phone}</strong> and enter your M-Pesa PIN to authorize <strong className="text-emerald-300 font-mono font-bold">KES {amount.toLocaleString()}</strong>.
                </p>
              </div>

              <div className="p-3 bg-[#0a0e17] rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Transaction Reference:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{externalReference || 'MP-PENDING'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                    Waiting for M-Pesa PIN confirmation...
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                >
                  Cancel Deposit
                </button>
              </div>
            </motion.div>
          ) : isProcessing && binancePromptStep && binanceOrder ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-3.5 relative z-10"
            >
              {/* Binance Pay QR Code / Icon */}
              <div className="relative mx-auto inline-block">
                {binanceOrder.qrcodeLink ? (
                  <div className="p-2 bg-white rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.25)] border-2 border-amber-400">
                    <img 
                      src={binanceOrder.qrcodeLink} 
                      alt="Binance Pay QR" 
                      className="w-36 h-36 mx-auto rounded-lg object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.35)] mx-auto">
                    <QrCode className="w-10 h-10 text-amber-400" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded-full border border-slate-900 shadow">
                  {countdown}s
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>Binance Pay Instant USDT</span>
                </div>
                <h4 className="font-bold text-white text-base">Scan or Pay with Binance</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Send <strong className="text-amber-400 font-mono font-bold">${binanceOrder.orderAmountUSDT} USDT</strong> (KES {amount.toLocaleString()}) via Binance App to credit your portfolio.
                </p>
              </div>

              <div className="p-3 bg-[#0a0e17] rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Trade Number:</span>
                  <span className="font-mono text-amber-400 font-semibold">{binanceOrder.merchantTradeNo}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                    Listening for Binance blockchain IPN...
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {binanceOrder.checkoutUrl && (
                  <a
                    href={binanceOrder.checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center gap-1.5 cursor-pointer block"
                  >
                    <span>Open in Binance Pay App / Web</span>
                  </a>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                >
                  Cancel Deposit
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleTriggerDeposit} className="space-y-4 text-xs relative z-10">
              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-rose-200">Payment Error</p>
                    <p className="text-[11px] text-rose-300/90">{errorMessage}</p>
                  </div>
                </div>
              )}
              {/* Payment Channel selector with Instant Badges */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Select Instant Deposit Channel
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* M-Pesa Instant STK */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setMethod('mpesa')}
                    className={`p-3 rounded-xl border text-left cursor-pointer flex flex-col justify-between transition relative overflow-hidden ${
                      method === 'mpesa'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'border-slate-800 bg-[#111726]/60 hover:bg-[#111726] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        M-Pesa STK
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                        ⚡ Instant
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">Direct phone PIN prompt</div>
                  </motion.button>

                  {/* Binance Pay Instant */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setMethod('binance')}
                    className={`p-3 rounded-xl border text-left cursor-pointer flex flex-col justify-between transition relative overflow-hidden ${
                      method === 'binance'
                        ? 'border-amber-500 bg-amber-500/10 text-white font-semibold shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'border-slate-800 bg-[#111726]/60 hover:bg-[#111726] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        Binance Pay
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold border border-amber-500/30">
                        ⚡ Instant
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">Instant USDT deposit</div>
                  </motion.button>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Quick Plan Presets</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[500, 900, 2500, 5000].map((val) => (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold cursor-pointer transition font-mono text-center ${
                        amount === val 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm' 
                          : 'bg-[#111726]/70 hover:bg-[#111726] text-slate-300 border-slate-800'
                      }`}
                    >
                      {val.toLocaleString()}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-300">Deposit Capital (KES)</label>
                  <span className="text-[11px] text-emerald-400 font-semibold">⚡ Instant Credit</span>
                </div>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-700/80 rounded-xl text-sm font-bold text-white font-mono focus:outline-none focus:border-emerald-500 transition"
                  min={100}
                  step={50}
                  required
                />
                <div className="mt-1 text-[11px] text-slate-400 font-mono">
                  ≈ ${usdtEquivalent} USDT (1 USDT = KES {settings.usdtToKesExchangeRate}) • 0% Deposit Fee
                </div>
              </div>

              {method === 'mpesa' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block font-semibold text-slate-300 mb-1">M-Pesa Mobile Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0e17] border border-slate-700/80 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="+254 712 345 678"
                    required
                  />
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Instant STK push will be received immediately on this phone.</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-[#111726] rounded-xl border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Official Merchant Pay ID:</span>
                    <span className="font-mono font-bold text-amber-400">77918204</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Send <strong className="text-white">${usdtEquivalent} USDT</strong> via Binance Pay for instant credit to your portfolio.
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                id="btn-confirm-deposit"
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl text-xs font-bold text-slate-950 transition cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                  method === 'mpesa' 
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]' 
                    : 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Instant Deposit...</span>
                  </>
                ) : method === 'mpesa' ? (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Send Instant STK Push (KES {amount.toLocaleString()})</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Deposit Instantly via Binance Pay (${usdtEquivalent} USDT)</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
