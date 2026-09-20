import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowUpCircle, 
  Zap, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck,
  Percent,
  Coins,
  ArrowRight,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { PlatformSettings, UserProfile, WithdrawalMethod } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  settings: PlatformSettings;
  onSubmitWithdrawal: (
    amountKES: number, 
    method: WithdrawalMethod, 
    destination: string, 
    accountName: string,
    feeKES: number,
    netAmountKES: number
  ) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onSubmitWithdrawal,
}) => {
  const [method, setMethod] = useState<WithdrawalMethod>('mpesa');
  const minWithdrawal = settings.minWithdrawalKES || 100;
  const [amount, setAmount] = useState<number>(() => Math.max(minWithdrawal, 100));
  const [mpesaPhone, setMpesaPhone] = useState(user.phone);
  const [mpesaName, setMpesaName] = useState(user.name);
  const [binanceId, setBinanceId] = useState('88419204');
  const [binanceName, setBinanceName] = useState(user.name);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTxRef, setSuccessTxRef] = useState('');

  // Synchronize initial default if settings or wallet change
  useEffect(() => {
    if (isOpen) {
      if (user.walletBalanceKES >= minWithdrawal && amount < minWithdrawal) {
        setAmount(minWithdrawal);
      }
    }
  }, [isOpen, minWithdrawal, user.walletBalanceKES]);

  if (!isOpen) return null;

  const maxAvailable = user.walletBalanceKES;
  const isAmountValid = amount >= minWithdrawal && amount <= maxAvailable;

  // Fee calculation: 10% for M-Pesa, 5% for Binance
  const feePercent = method === 'mpesa' 
    ? (settings.mpesaWithdrawalFeePercent ?? 10) 
    : (settings.binanceWithdrawalFeePercent ?? 5);

  const feeKES = isAmountValid ? Math.round(amount * (feePercent / 100)) : 0;
  const netAmountKES = isAmountValid ? Math.max(0, amount - feeKES) : 0;
  const usdtEquivalentNet = (netAmountKES / settings.usdtToKesExchangeRate).toFixed(2);
  const usdtEquivalentGross = (amount / settings.usdtToKesExchangeRate).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid) return;

    const destination = method === 'mpesa' 
      ? mpesaPhone 
      : `Binance Pay ID: ${binanceId} (${usdtEquivalentNet} USDT)`;
    const accountName = method === 'mpesa' ? mpesaName : binanceName;

    const ref = method === 'binance' 
      ? `BINANCE-PAY-INSTANT-${Date.now().toString().slice(-6)}` 
      : `MPESA-B2C-${Date.now().toString().slice(-6)}`;

    onSubmitWithdrawal(amount, method, destination, accountName, feeKES, netAmountKES);
    setSuccessTxRef(ref);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
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
          {/* Ambient decorative glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner"
              >
                <ArrowUpCircle className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">Withdraw Returns</h3>
                <p className="text-xs text-slate-400">Min. KES 100 • Automated Settlement</p>
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
                <h4 className="font-bold text-white text-base">
                  {method === 'binance' ? '⚡ Instant Binance Pay Executed!' : 'M-Pesa Withdrawal Queued'}
                </h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  {method === 'binance' ? (
                    <span>
                      Instant automated disbursement of <strong className="text-amber-400 font-mono font-bold">${usdtEquivalentNet} USDT</strong> (Net after 5% fee) sent to your Binance Pay account.
                    </span>
                  ) : (
                    <span>
                      Withdrawal of <strong className="text-white font-mono">KES {netAmountKES.toLocaleString()}</strong> (Net after 10% fee) is queued. M-Pesa withdrawals <strong className="text-emerald-300">take up to 6 hours</strong>.
                    </span>
                  )}
                </p>
              </div>

              {/* Summary Receipt Box */}
              <div className="p-3 bg-[#0a0e17] rounded-xl border border-slate-800 text-xs space-y-1 text-left font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Requested:</span>
                  <span className="text-white">KES {amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Fee Applied ({feePercent}%):</span>
                  <span>-KES {feeKES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Net Disbursed:</span>
                  <span>
                    KES {netAmountKES.toLocaleString()} {method === 'binance' && `(≈ $${usdtEquivalentNet} USDT)`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Reference: {successTxRef}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close & View Wallet
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs relative z-10">
              {/* Anti-Fraud Kill Switch Warning */}
              {user.isFrozen && (
                <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-400">
                    <Lock className="w-4 h-4" />
                    <span>Account Frozen by Anti-Fraud Protocol</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {user.freezeReason || 'All capital payout operations are locked pending compliance review.'} Please contact Live Compliance Support.
                  </p>
                </div>
              )}

              {/* Wallet balance chip */}
              <motion.div 
                whileHover={{ y: -1 }}
                className="flex justify-between items-center p-3.5 bg-[#111726]/80 rounded-xl border border-slate-800 shadow-sm"
              >
                <span className="text-slate-400 font-medium">Available Withdrawable Capital</span>
                <span className="font-extrabold text-white text-sm font-mono">
                  KES {user.walletBalanceKES.toLocaleString()}
                </span>
              </motion.div>

              {/* Payout Rail Selection Tabs with Timings & Fee Tags */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-semibold text-slate-300">
                    Select Payout Rail
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Min: <strong className="text-white">KES {minWithdrawal}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* M-Pesa Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    id="tab-withdraw-mpesa"
                    onClick={() => setMethod('mpesa')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      method === 'mpesa'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'border-slate-800 bg-[#111726]/60 hover:bg-[#111726] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        M-Pesa B2C
                      </span>
                      <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded-full font-semibold border border-amber-500/20 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        ≤ 6 Hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Withdrawal Fee:</span>
                      <span className="font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">10%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Takes up to 6 hours for Safaricom queue</p>
                  </motion.button>

                  {/* Binance Pay Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    id="tab-withdraw-binance"
                    onClick={() => setMethod('binance')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      method === 'binance'
                        ? 'border-amber-500 bg-amber-500/10 text-white font-semibold shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'border-slate-800 bg-[#111726]/60 hover:bg-[#111726] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        Binance Pay
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-500/30 animate-pulse">
                        ⚡ Instant
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Withdrawal Fee:</span>
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">5%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Instant USDT automated transfer</p>
                  </motion.button>
                </div>
              </div>

              {/* Amount input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-300">Gross Withdrawal Amount (KES)</label>
                  <span className="text-[11px] text-slate-400 font-mono">Min: KES {minWithdrawal}</span>
                </div>
                <div className="relative">
                  <input
                    id="input-withdraw-amount"
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={minWithdrawal}
                    max={maxAvailable}
                    className={`w-full px-3 py-2.5 bg-[#0a0e17] border rounded-xl text-sm font-bold font-mono focus:outline-none transition ${
                      isAmountValid 
                        ? 'border-slate-700/80 text-white focus:border-emerald-500' 
                        : 'border-rose-500/60 text-rose-400'
                    }`}
                    placeholder="Min KES 100"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setAmount(maxAvailable)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-[11px] font-bold cursor-pointer transition"
                  >
                    MAX
                  </motion.button>
                </div>

                {/* Validation Warnings */}
                {amount < minWithdrawal && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Minimum withdrawal is KES {minWithdrawal}.
                  </motion.p>
                )}
                {amount > maxAvailable && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Requested amount exceeds available balance of KES {maxAvailable.toLocaleString()}
                  </motion.p>
                )}
              </div>

              {/* Dynamic Fee & Net Calculation Card */}
              <motion.div 
                layout
                className="p-3.5 bg-[#0b0f19] rounded-xl border border-slate-800 space-y-2 shadow-inner"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Gross Withdrawal:</span>
                  <span className="font-mono text-white font-semibold">KES {amount.toLocaleString() || '0'}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    Withdrawal Fee ({feePercent}%):
                  </span>
                  <span className="font-mono text-rose-400 font-semibold">-KES {feeKES.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs block">Net Disbursed to You:</span>
                    <span className="text-[10px] text-slate-400">
                      {method === 'mpesa' ? 'Via M-Pesa (Takes up to 6 hrs)' : 'Via Binance Pay (⚡ Instant)'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-emerald-400 font-mono block">
                      KES {netAmountKES.toLocaleString()}
                    </span>
                    {method === 'binance' && (
                      <span className="text-[10px] text-amber-400 font-mono">
                        ≈ ${usdtEquivalentNet} USDT
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Destination inputs based on method */}
              {method === 'mpesa' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5 p-3.5 bg-[#111726]/60 rounded-xl border border-slate-800"
                >
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Safaricom Mobile Number
                    </label>
                    <input
                      id="input-mpesa-phone"
                      type="text"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0a0e17] border border-slate-700/80 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. +254 712 345 678"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Registered Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={mpesaName}
                      onChange={(e) => setMpesaName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0a0e17] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. Jane Wanjiku"
                      required
                    />
                  </div>
                  <div className="text-[10px] text-amber-300 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>M-Pesa B2C queue processing: withdrawal takes up to 6 hours to settle.</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5 p-3.5 bg-[#111726]/60 rounded-xl border border-slate-800"
                >
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Binance Pay ID / USDT Address
                    </label>
                    <input
                      id="input-binance-id"
                      type="text"
                      value={binanceId}
                      onChange={(e) => setBinanceId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0a0e17] border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                      placeholder="e.g. 88419204 or USDT BEP-20 address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Binance Account Name / Alias
                    </label>
                    <input
                      type="text"
                      value={binanceName}
                      onChange={(e) => setBinanceName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0a0e17] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      placeholder="e.g. Jane Wanjiku"
                      required
                    />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                    <span>Instant automated USDT settlement via Binance Pay API with 5% fee.</span>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: (isAmountValid && !user.isFrozen) ? 1.02 : 1 }}
                whileTap={{ scale: (isAmountValid && !user.isFrozen) ? 0.98 : 1 }}
                type="submit"
                id="btn-submit-withdrawal"
                disabled={!isAmountValid || user.isFrozen}
                className={`w-full py-3 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                  user.isFrozen
                    ? 'bg-rose-950/40 text-rose-400/60 cursor-not-allowed border border-rose-900/50'
                    : isAmountValid
                    ? method === 'binance'
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                }`}
              >
                {user.isFrozen ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Payouts Suspended (Account Locked)</span>
                  </>
                ) : method === 'binance' ? (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Withdraw Instantly (${usdtEquivalentNet} USDT • 5% Fee)</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Withdraw to M-Pesa (Net KES {netAmountKES.toLocaleString()} • 10% Fee)</span>
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
