import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  Network, 
  Award, 
  ArrowUpRight, 
  UserPlus, 
  Layers,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ReferralMember, PlatformSettings, UserProfile } from '../types';

interface ReferralsViewProps {
  user: UserProfile;
  referrals: ReferralMember[];
  settings: PlatformSettings;
}

export const ReferralsView: React.FC<ReferralsViewProps> = ({
  user,
  referrals,
  settings,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [selectedTierFilter, setSelectedTierFilter] = useState<number | 'all'>('all');

  const referralLink = `https://royalservice.ke/join?ref=${user.referralCode}`;
  const invitePitch = `👑 Join my Royal Service investment team! Earn daily returns in KES or USDT with instant withdrawals. Use my referral code: ${user.referralCode} or sign up here: ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const tier1Members = referrals.filter(r => r.tier === 1);
  const tier2Members = referrals.filter(r => r.tier === 2);
  const tier3Members = referrals.filter(r => r.tier === 3);

  const tier1Commission = tier1Members.reduce((sum, r) => sum + r.commissionEarnedKES, 0);
  const tier2Commission = tier2Members.reduce((sum, r) => sum + r.commissionEarnedKES, 0);
  const tier3Commission = tier3Members.reduce((sum, r) => sum + r.commissionEarnedKES, 0);

  const filteredReferrals = selectedTierFilter === 'all' 
    ? referrals 
    : referrals.filter(r => r.tier === selectedTierFilter);

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(invitePitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(invitePitch)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Hero: Referral Hub */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#120f26] via-[#0e1322] to-[#080d16] text-white rounded-2xl p-6 sm:p-8 border border-purple-500/20 relative overflow-hidden shadow-2xl space-y-5"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Network className="w-3.5 h-3.5" />
            <span>3-Tier Compound Affiliate Protocol</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Expand Your Team & Earn Tiered Bonuses
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Distribute your unique partner invite link to activate multi-level compensation. Every contract funded by your direct recruits or downline sub-partners triggers instant credits to your wallet.
          </p>

          {/* Referral Link & Code Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#0a0e17]/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Your Partner Code</span>
              <div className="flex items-center justify-between bg-[#111726] px-3 py-2 rounded-lg border border-slate-700/60">
                <span className="font-mono font-bold text-sm text-emerald-400">{user.referralCode}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  id="btn-copy-ref-code"
                  onClick={handleCopyCode}
                  className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            <div className="bg-[#0a0e17]/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Direct Invitation Link</span>
              <div className="flex items-center justify-between bg-[#111726] px-3 py-2 rounded-lg border border-slate-700/60">
                <span className="font-mono text-xs text-slate-300 truncate max-w-[220px]">{referralLink}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  id="btn-copy-ref-link"
                  onClick={handleCopyLink}
                  className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Copy link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Multi-Tier Commission Structure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -3 }}
          className="bg-[#0d1320] rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                Tier 1 (Direct)
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {settings.tier1CommissionPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct invitations by your link. When a partner starts Silver (KES 1,300), you earn <strong className="text-emerald-300 font-mono">KES {(1300 * (settings.tier1CommissionPercent/100)).toFixed(0)}</strong> instantly.
            </p>
          </div>
          <div className="p-3 bg-[#0a0e17] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">{tier1Members.length} Partners</span>
            <span className="font-bold text-white font-mono">KES {tier1Commission.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Tier 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="bg-[#0d1320] rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-500/30 px-3 py-0.5 rounded-full">
                Tier 2 (Secondary)
              </span>
              <span className="text-2xl font-black text-blue-400 font-mono">
                {settings.tier2CommissionPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Invited by your Tier 1 teammates. On an activation of KES 1,300, you automatically earn <strong className="text-blue-300 font-mono">KES {(1300 * (settings.tier2CommissionPercent/100)).toFixed(0)}</strong>.
            </p>
          </div>
          <div className="p-3 bg-[#0a0e17] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">{tier2Members.length} Partners</span>
            <span className="font-bold text-white font-mono">KES {tier2Commission.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Tier 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="bg-[#0d1320] rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-0.5 rounded-full">
                Tier 3 (Network)
              </span>
              <span className="text-2xl font-black text-purple-400 font-mono">
                {settings.tier3CommissionPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Invited by Tier 2 members. Automatically provides passive depth rewards across your expanding community.
            </p>
          </div>
          <div className="p-3 bg-[#0a0e17] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">{tier3Members.length} Partners</span>
            <span className="font-bold text-white font-mono">KES {tier3Commission.toLocaleString()}</span>
          </div>
        </motion.div>
      </div>

      {/* Team Invitation & Share Toolkit */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0d1320] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              Direct Team Invitation & Quick Share
            </h3>
            <p className="text-xs text-slate-400">
              Transmit your ready-to-use invitation pitch directly to WhatsApp groups or social networks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyPitch}
              className="px-3.5 py-2 bg-[#121929] hover:bg-[#162033] text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              {copiedPitch ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedPitch ? 'Pitch Copied!' : 'Copy Invite Pitch'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShareWhatsApp}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Downline Members Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0d1320] rounded-2xl border border-slate-800 overflow-hidden shadow-xl"
      >
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              Referral Network Breakdown ({referrals.length} Total Recruits)
            </h3>
            <p className="text-xs text-slate-400">Live downline status, capital generated, and commission distributions</p>
          </div>

          {/* Tier Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#0a0e17] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedTierFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedTierFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({referrals.length})
            </button>
            <button
              onClick={() => setSelectedTierFilter(1)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedTierFilter === 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tier 1 ({tier1Members.length})
            </button>
            <button
              onClick={() => setSelectedTierFilter(2)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedTierFilter === 2 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tier 2 ({tier2Members.length})
            </button>
            <button
              onClick={() => setSelectedTierFilter(3)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedTierFilter === 3 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tier 3 ({tier3Members.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0a0e17] text-slate-400 border-b border-slate-800">
                <th className="py-3 px-5 font-semibold">User</th>
                <th className="py-3 px-5 font-semibold">Tier Level</th>
                <th className="py-3 px-5 font-semibold">Referred By</th>
                <th className="py-3 px-5 font-semibold">Active Plan</th>
                <th className="py-3 px-5 font-semibold text-right">Volume Invested</th>
                <th className="py-3 px-5 font-semibold text-right">Bonus Disbursed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReferrals.map((member) => (
                <tr key={member.id} className="hover:bg-[#111726]/40 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-white">
                    <div>{member.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{member.phoneOrEmail}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      member.tier === 1 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : member.tier === 2 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      Tier {member.tier} ({member.tier === 1 ? settings.tier1CommissionPercent : member.tier === 2 ? settings.tier2CommissionPercent : settings.tier3CommissionPercent}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400">{member.referredBy}</td>
                  <td className="py-3.5 px-5 text-slate-300 font-medium">{member.packageActive}</td>
                  <td className="py-3.5 px-5 text-right font-mono font-medium text-slate-200">
                    KES {member.totalDepositedKES.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-emerald-400">
                    +KES {member.commissionEarnedKES.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
