import { useAppContext } from '../context/AppContext';
import { Crown, Sparkles, TrendingUp, Users, Target } from 'lucide-react';

export default function Community() {
  const { stats } = useAppContext();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-12 text-center mt-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 relative z-10 flex items-center justify-center gap-4">
          <Crown className="w-10 h-10 text-gold" />
          Community Reward Pool
        </h1>
        <p className="text-lg text-gray-400 relative z-10">Global royalty sharing for elite rank achievers.</p>
      </header>

      {/* Main Stats */}
      <div className="glassmorphism p-8 md:p-12 rounded-3xl text-center mb-8 border border-gold/30 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-32 h-32 text-gold" /></div>
         <p className="text-gold font-bold tracking-widest uppercase mb-4 w-full flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" /> Live Global Pool
         </p>
         <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gold to-yellow-200 font-mono tracking-tighter">
            ${stats.royalPool.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
         </h2>
         <p className="text-gray-400 mt-6 max-w-lg mx-auto">
            Funded continuously by Cycle 2+ upgrades. Distributed monthly to Rising, Prime, Royal, and Legendary rank holders.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-navy-light/50 border border-navy-border p-6 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-emerald-400 mb-4" />
            <p className="text-sm text-gray-400 mb-1">Monthly Distribution</p>
            <h3 className="text-2xl font-bold text-white">Every 30th</h3>
         </div>
         <div className="bg-navy-light/50 border border-navy-border p-6 rounded-2xl">
            <Users className="w-6 h-6 text-neon-blue mb-4" />
            <p className="text-sm text-gray-400 mb-1">Eligible Members</p>
            <h3 className="text-2xl font-bold text-white">1,402</h3>
         </div>
         <div className="bg-navy-light/50 border border-navy-border p-6 rounded-2xl">
            <Target className="w-6 h-6 text-purple-400 mb-4" />
            <p className="text-sm text-gray-400 mb-1">Your Eligibility</p>
            <h3 className={`text-xl font-bold ${stats.rank !== 'Starter' ? 'text-emerald-400' : 'text-rose-400'}`}>
               {stats.rank !== 'Starter' ? 'Eligible (' + stats.rank + ')' : 'Not Eligible (Starter)'}
            </h3>
         </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Distribution Tiers</h2>
      <div className="space-y-4">
         {[
            { rank: 'Rising', share: '10%', req: 'Slot 4 Active' },
            { rank: 'Prime', share: '20%', req: 'Slot 7 Active' },
            { rank: 'Royal', share: '30%', req: 'Slot 10 Active' },
            { rank: 'Legendary', share: '40%', req: 'Slot 12 Active (Max)' }
         ].map((tier, i) => (
            <div key={i} className="glassmorphism p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
               <div>
                  <h4 className="text-xl font-bold text-white">{tier.rank} Tier</h4>
                  <p className="text-sm text-gray-400">Requirement: {tier.req}</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right">
                     <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Pool Share</p>
                     <p className="text-2xl font-black text-gold">{tier.share}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full border ${stats.rank === tier.rank ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-navy border-navy-border text-gray-500'} font-bold text-sm`}>
                     {stats.rank === tier.rank ? 'Current Tier' : 'Locked'}
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
