import { useAppContext } from '../context/AppContext';
import { Crown, CheckCircle2, Lock, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Membership() {
  const { slots } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-12 text-center mt-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white mb-4">
          Equinox Global Roadmap
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Unlock slots, multiply referral rewards, and earn community income. <br/>
          Decentralized 14-Position Co-Matrix powered by Smart Contracts.
        </p>
      </header>

      {/* Plan Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         <div className="glassmorphism p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-neon-blue/20 transition-all" />
            <h3 className="text-2xl font-bold text-white mb-4">Cycle 1 Mechanics</h3>
            <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0" /> 2 Incomes (Pos 1&2) sent directly to Uplines.</li>
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0" /> 6 Incomes paid instantly to your personal wallet.</li>
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> 2 Incomes (Pos 4&9) automatically held for next slot upgrade.</li>
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0" /> 3 Incomes distributed to downlines as team spillover.</li>
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" /> 1 Income (Pos 14) triggers full matrix recycle.</li>
            </ul>
         </div>

         <div className="glassmorphism p-8 rounded-3xl relative overflow-hidden group border border-gold/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-gold/20 transition-all" />
            <h3 className="text-2xl font-bold text-gold mb-4">Cycle 2+ Mechanics</h3>
            <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Upgrade deductions drop permanently to $0.</li>
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Direct wallet payouts increase to 7 full incomes.</li>
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-gold shrink-0" /> 1 Income routed permanently to Global Royal Pool.</li>
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0" /> Upline and Downline spillover rules remain identical.</li>
               <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" /> Unlimited lifetime recycles without further purchases.</li>
            </ul>
         </div>
      </div>

      <div className="flex items-center justify-between mb-6">
         <h2 className="text-2xl font-bold text-white">The 12-Slot Upgrade Path</h2>
         <button onClick={() => navigate('/')} className="text-neon-blue text-sm hover:underline font-bold flex items-center gap-1">
            View Live Board <ArrowRight className="w-4 h-4" />
         </button>
      </div>

      <div className="space-y-4 relative">
         <div className="absolute left-8 top-8 bottom-8 w-px bg-navy-border hidden md:block"></div>
         
         {slots.map((slot, idx) => {
            let specialTag = '';
            let tagColor = '';
            if (slot.id === 4) { specialTag = "Achieves 'Rising' Rank + NFT Bonus"; tagColor = 'text-blue-400 border-blue-400/30 bg-blue-400/10'; }
            if (slot.id === 7) { specialTag = "Achieves 'Prime' Rank"; tagColor = 'text-purple-400 border-purple-400/30 bg-purple-400/10'; }
            if (slot.id === 10) { specialTag = "Achieves 'Royal' Rank"; tagColor = 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'; }
            if (slot.id === 12) { specialTag = "Achieves 'Legendary' Rank - Max Out"; tagColor = 'text-gold border-gold/30 bg-gold/10'; }

            return (
               <motion.div 
                 key={slot.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.05 }}
                 className={`ml-0 md:ml-16 glassmorphism p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between relative ${!slot.locked ? 'border-neon-blue/30' : ''}`}
               >
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-navy border-2 border-navy-border flex items-center justify-center z-10 hidden md:flex">
                     {!slot.locked ? <div className="w-3 h-3 bg-neon-blue rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" /> : <Lock className="w-4 h-4 text-gray-500" />}
                  </div>

                  <div className="flex-1 text-center md:text-left w-full">
                     <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <span className={`text-xl font-black ${!slot.locked ? 'text-white' : 'text-gray-500'}`}>Slot {slot.id}</span>
                        {!slot.locked && <span className="bg-neon-blue/20 text-neon-blue text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>}
                     </div>
                     <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-4 text-sm text-gray-400">
                        <span>Entry: <strong className={!slot.locked ? 'text-neon-blue' : 'text-gray-300'}>${slot.cost.toLocaleString()}</strong></span>
                        <ArrowRight className="hidden md:block w-4 h-4 opacity-50" />
                        <span>Max Rev / Cycle: <strong className="text-white">${(slot.cost * 6).toLocaleString()}</strong></span>
                        {slot.id < 12 && (
                           <>
                             <ArrowRight className="hidden md:block w-4 h-4 opacity-50" />
                             <span>Auto-Upgrade: <strong className="text-purple-400">${(slots[idx + 1]?.cost || 0).toLocaleString()}</strong></span>
                           </>
                        )}
                     </div>
                     
                     {specialTag && (
                        <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border ${tagColor}`}>
                           <Star className="w-3 h-3" /> {specialTag}
                        </div>
                     )}
                  </div>
                  
                  {slot.locked ? (
                     <button className="px-6 py-3 w-full md:w-auto rounded-xl border border-navy-border bg-black/20 text-gray-400 font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock className="w-4 h-4" /> Locked
                     </button>
                  ) : (
                     <button onClick={() => navigate('/')} className="px-6 py-3 w-full md:w-auto rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-navy transition-colors font-bold whitespace-nowrap">
                        View Matrix
                     </button>
                  )}
               </motion.div>
            )
         })}
      </div>
    </div>
  );
}
