import { useEquinox } from '../context/EquinoxContext';
import { Gem, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function NFTWidget() {
  const { stats, sellNFT } = useEquinox();

  if (!stats.nftMinted) {
    return (
       <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
          <Gem className="w-12 h-12 text-gray-700 mb-4" />
          <h3 className="text-gray-500 font-medium">NFT Burned / Not Minted</h3>
          <p className="text-xs text-gray-600 mt-2">Activate Slot 1 to receive a new Welcome Pass.</p>
       </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-gray-900 border border-indigo-500/30 rounded-2xl p-1 relative overflow-hidden h-full">
      {/* Glare effect */}
      <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      
      <div className="bg-gray-950/80 backdrop-blur-sm rounded-xl p-6 h-full flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
             <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Asset Class</span>
             <h3 className="text-xl font-bold text-white">Welcome Pass</h3>
          </div>
          <div className="p-2 bg-indigo-500/20 rounded-lg">
             <Gem className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center my-4">
           {/* Abstract NFT Visual */}
           <div className="relative w-32 h-40 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 rounded-lg shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center p-1">
              <div className="w-full h-full bg-gray-950/40 backdrop-blur-sm rounded-md flex flex-col items-center justify-center border border-white/20">
                 <HexagonOutline className="w-12 h-12 text-white/80" />
                 <span className="text-[8px] font-mono text-white/50 mt-4">EQNX-PASS</span>
              </div>
           </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-end mb-4">
             <div>
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" /> Live Market Value
                </p>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                   ${stats.nftMarketValue.toFixed(2)}
                </div>
             </div>
          </div>
          
          <button 
             onClick={sellNFT}
             className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
             Liquidate & Sell Asset
             <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function HexagonOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}
