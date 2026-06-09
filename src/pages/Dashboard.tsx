import { useAppContext } from '../context/AppContext';
import { Wallet, Crown, ChevronRight, LogOut, ArrowRightCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatrixBoard from '../components/MatrixBoard';
import SlotGrid from '../components/SlotGrid';

export function QuickAction({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="glassmorphism p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-neon-blue/50 transition-colors group">
      <div className="w-12 h-12 rounded-full bg-navy border border-navy-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.15)]">
        <Icon className="w-6 h-6 text-neon-blue" />
      </div>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white">{label}</span>
    </button>
  );
}

export default function Dashboard() {
  const { stats } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back, Nexoran</h1>
          <p className="text-sm text-gray-400">Your decentralized matrix is active</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 glassmorphism rounded-full border-neon-blue/30">
             <Crown className="w-4 h-4 text-gold" />
             <span className="text-gold font-bold text-sm tracking-wide">{stats.rank} Rank</span>
           </div>
        </div>
      </header>

      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="glassmorphism rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-16 h-16" /></div>
            <p className="text-sm text-gray-400 mb-2">Available Balance</p>
            <h2 className="text-3xl font-black font-mono tracking-tight text-white">
               ${stats.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
         </div>
         <div className="glassmorphism rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">Total Earned</p>
            <h2 className="text-3xl font-black font-mono tracking-tight text-emerald-400">
               ${stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
         </div>
         <div className="glassmorphism rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">Total Deposits</p>
            <h2 className="text-3xl font-black font-mono tracking-tight text-blue-400">
               ${stats.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
         </div>
         <div className="glassmorphism rounded-2xl p-6 border border-gold/30">
            <p className="text-sm text-gold mb-2 flex items-center gap-2">Global Royal Pool</p>
            <h2 className="text-3xl font-black font-mono tracking-tight text-white mb-1">
               ${stats.royalPool.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction icon={Plus} label="Add Funds" onClick={() => navigate('/wallet')} />
        <QuickAction icon={Wallet} label="Withdraw" onClick={() => navigate('/wallet')} />
        <QuickAction icon={Crown} label="Membership" onClick={() => navigate('/membership')} />
        <QuickAction icon={ChevronRight} label="Network" onClick={() => navigate('/network')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 mt-2">
         <div className="xl:col-span-2 flex flex-col">
            <MatrixBoard />
         </div>
         <div className="xl:col-span-1">
            <SlotGrid />
         </div>
      </div>
    </div>
  );
}
