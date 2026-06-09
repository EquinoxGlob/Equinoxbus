import { useEquinox } from '../context/EquinoxContext';
import { Wallet, Crown, ChevronRight, LogOut } from 'lucide-react';
import MatrixBoard from './MatrixBoard';
import SlotGrid from './SlotGrid';
import NFTWidget from './NFTWidget';

export default function Dashboard() {
  const { stats, disconnectWallet } = useEquinox();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
             <span className="font-black text-xl">EQ</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">EQUINOX</h1>
            <p className="text-xs text-gray-500">ID: 10492 | Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-gray-400 font-mono">BSC Network Connected</span>
           </div>
           <button 
             onClick={disconnectWallet}
             className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-gray-400 transition-colors"
           >
             <LogOut className="w-4 h-4" />
           </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Top Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
           <div className="bg-gradient-to-br from-green-900/40 to-gray-900 border border-green-900/50 rounded-2xl p-6 flex justify-between items-center">
              <div>
                 <p className="text-sm text-green-400 mb-1 flex items-center gap-2 font-medium">
                    <Wallet className="w-4 h-4" /> Personal Liquid Earnings
                 </p>
                 <h2 className="text-4xl font-black font-mono tracking-tight text-white">
                    ${stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </h2>
              </div>
           </div>
           
           <div className="bg-gradient-to-br from-amber-900/40 to-gray-900 border border-amber-900/50 rounded-2xl p-6 flex justify-between items-center">
              <div>
                 <p className="text-sm text-amber-400 mb-1 flex items-center gap-2 font-medium">
                    <Crown className="w-4 h-4" /> Global Royal Pool
                 </p>
                 <h2 className="text-4xl font-black font-mono tracking-tight text-white mb-1">
                    ${stats.royalPool.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </h2>
                 <p className="text-xs text-gray-500">Injects 50% liquidity to Welcome Pass NFT</p>
              </div>
           </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
           {/* Matrix Module (spanning 2 columns on large screens) */}
           <div className="lg:col-span-2">
              <MatrixBoard />
           </div>
           
           {/* NFT Module */}
           <div className="lg:col-span-1">
              <NFTWidget />
           </div>
        </div>

        {/* Slot Selection Grid */}
        <SlotGrid />
      </main>
    </div>
  );
}
