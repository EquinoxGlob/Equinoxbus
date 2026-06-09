import { useAppContext } from '../context/AppContext';
import { Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function SlotGrid() {
  const { slots, activeSlotId, setActiveSlotId } = useAppContext();

  return (
    <div className="glassmorphism rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-white mb-6">12 SLOTS TO ABUNDANCE</h2>
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
        {slots.map((slot) => {
          const isActive = slot.id === activeSlotId;
          const isUnlocked = !slot.locked;
          
          return (
            <motion.div
              layout
              key={slot.id}
              onClick={() => isUnlocked && setActiveSlotId(slot.id)}
              className={`p-4 rounded-xl border relative cursor-pointer transition-all duration-300 ${
                isActive 
                  ? 'bg-neon-blue/10 border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                  : isUnlocked 
                    ? 'bg-navy-light/50 border-navy-border hover:border-gray-500' 
                    : 'bg-navy/80 border-navy-border opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded bg-navy ${isActive ? 'text-neon-blue' : 'text-gray-400'}`}>
                  SLOT {slot.id}
                </span>
                {isUnlocked ? (
                  <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-neon-blue' : 'text-neon-blue-dark'}`} />
                ) : (
                  <Lock className="w-4 h-4 text-gray-600" />
                )}
              </div>
              
              <div className="text-xl font-black text-white mb-1">${slot.cost}</div>
              
              {isUnlocked && (
                <div className="mt-auto pt-2 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Cycle {slot.cycle}</span>
                  <div className="flex gap-1">
                     <span className="text-gray-300 font-mono">{slot.filledPositions}</span>
                     <span className="text-gray-600 font-mono">/ 14</span>
                  </div>
                </div>
              )}
              
              {!isUnlocked && (
                 <div className="mt-auto pt-2 text-[10px] text-gray-500 flex items-center justify-between">
                    REQUIRES UPGRADE
                 </div>
              )}
              
              {/* Progress Bar */}
              {isUnlocked && (
                 <div className="absolute bottom-0 left-0 h-1 bg-navy-light w-full rounded-b-xl overflow-hidden">
                    <motion.div 
                       className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.8)]" 
                       initial={{ width: 0 }}
                       animate={{ width: `${(slot.filledPositions / 14) * 100}%` }}
                    />
                 </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
