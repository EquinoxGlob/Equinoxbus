import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Network, ArrowRightCircle } from 'lucide-react';
import { motion } from 'motion/react';

function getPositionConfig(pos: number, cycle: number) {
  if (pos === 1 || pos === 2) return { label: 'Upline Loss', color: 'bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' };
  if ([3, 5, 6, 8, 11, 12].includes(pos)) return { label: 'Direct Income', color: 'bg-neon-blue/10 border-neon-blue/50 text-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]' };
  if (pos === 4 || pos === 9) {
    if (cycle === 1) return { label: 'Upgrade Hold', color: 'bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' };
    if (cycle > 1 && pos === 4) return { label: 'Direct Income', color: 'bg-neon-blue/10 border-neon-blue/50 text-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]' };
    if (cycle > 1 && pos === 9) return { label: 'Royal Pool', color: 'bg-gold/10 border-gold/50 text-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]' };
  }
  if ([7, 10, 13].includes(pos)) return { label: 'Spillover', color: 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' };
  if (pos === 14) return { label: 'Recycle', color: 'bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]' };
  return { label: 'Empty', color: 'bg-navy-light border-navy-border text-gray-600' };
}

export default function MatrixBoard() {
  const { slots, activeSlotId, simulateFill } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const activeSlot = slots.find(s => s.id === activeSlotId);

  if (!activeSlot) return null;

  const handleSimulateFill = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    // offload logic execution and give a tiny UI response window
    await new Promise(r => setTimeout(r, 100));
    simulateFill();
    setIsProcessing(false);
  };

  const positions = Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    isFilled: (i + 1) <= activeSlot.filledPositions
  }));

  const l1 = positions.slice(0, 2);
  const l2 = positions.slice(2, 6);
  const l3 = positions.slice(6, 14);

  const renderNode = (pos: { id: number, isFilled: boolean }) => {
    const config = pos.isFilled ? getPositionConfig(pos.id, activeSlot.cycle) : getPositionConfig(-1, activeSlot.cycle);
    return (
      <motion.div
        key={pos.id}
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-bold relative group ${config.color} transition-all duration-300`}
      >
        {pos.isFilled ? (
          <span className="z-10">{pos.id}</span>
        ) : (
          <span className="opacity-30">{pos.id}</span>
        )}
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-navy-light/90 backdrop-blur-sm border border-navy-border text-gray-300 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
          {pos.isFilled ? config.label : 'Empty Position'}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-8 z-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-neon-blue" />
            SLOT {activeSlot.id} MATRIX
          </h2>
          <p className="text-sm text-gray-400 mt-1">Cost: ${activeSlot.cost} | Cycle {activeSlot.cycle}</p>
        </div>
        <button
          onClick={handleSimulateFill}
          disabled={isProcessing}
          className={`flex items-center gap-2 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue hover:text-navy px-4 py-2 rounded-lg font-bold transition-all border border-neon-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Processing' : 'Simulate Fill'}
          <ArrowRightCircle className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-10 pb-8 z-10 w-full overflow-x-auto min-w-[300px]">
        {/* User */}
        <div className="flex justify-center w-full">
          <div className="w-14 h-14 rounded-full bg-navy border-2 border-neon-blue shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center">
            <span className="font-bold text-neon-blue text-xs">YOU</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-10 md:gap-32 w-full relative">
          {l1.map(pos => renderNode(pos))}
        </div>
        <div className="flex justify-center gap-2 md:gap-8 w-full">
           {l2.map(pos => renderNode(pos))}
        </div>
        <div className="flex justify-center gap-1 md:gap-4 w-full">
           {l3.map(pos => renderNode(pos))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-auto grid grid-cols-2 lg:grid-cols-5 gap-2 text-[10px] text-gray-400 z-10 bg-navy-light/50 border border-navy-border p-3 rounded-lg">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Upline Loss</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-neon-blue"></div>Direct Income</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Upgrade/Hold</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>Spillover</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Recycle</div>
      </div>
    </div>
  );
}
