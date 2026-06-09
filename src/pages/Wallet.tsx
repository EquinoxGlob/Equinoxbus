import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, History, AlertCircle, CheckCircle2, ArrowRightLeft } from 'lucide-react';

export default function Wallet() {
  const { stats, depositFunds, withdrawFunds, userTransferVirtualFunds } = useAppContext();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  // Transfer State
  const [txUser, setTxUser] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txPin, setTxPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }
    
    setIsProcessing(true);
    // Non-blocking async check
    await new Promise(res => setTimeout(res, 200));
    
    depositFunds(amount);
    setDepositAmount('');
    setMessage({ text: `Successfully deposited $${amount}`, type: 'success' });
    setIsProcessing(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 50) {
      setMessage({ text: 'Minimum withdrawal is $50', type: 'error' });
      return;
    }
    if (amount > stats.availableBalance) {
      setMessage({ text: 'Insufficient balance', type: 'error' });
      return;
    }
    
    setIsProcessing(true);
    await new Promise(res => setTimeout(res, 300));

    withdrawFunds(amount);
    setWithdrawAmount('');
    setMessage({ text: `Withdrawal request for $${amount} submitted`, type: 'success' });
    setIsProcessing(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Artificial network delay to offload thread
    await new Promise(res => setTimeout(res, 400));

    const { success, message: msg } = userTransferVirtualFunds(txUser, parseFloat(txAmount), txPin);
    if (success) {
      setMessage({ text: msg, type: 'success' });
      setTxUser(''); setTxAmount(''); setTxPin('');
    } else {
      setMessage({ text: msg, type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <WalletIcon className="w-8 h-8 text-neon-blue" />
          Wallet
        </h1>
        <p className="text-gray-400 mt-2">Manage your funds and matrix liquidity</p>
      </header>

      {message && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Wallet Overview */}
        <div className="glassmorphism rounded-3xl p-6 md:p-8 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 border border-neon-blue/20">
           <div>
              <p className="text-sm text-gray-400 mb-1">Available Withdrawal Balance</p>
              <h3 className="text-3xl font-black text-white">${stats.availableBalance.toFixed(2)}</h3>
           </div>
           <div>
              <p className="text-sm text-gray-400 mb-1">Virtual / Credit Balance</p>
              <h3 className="text-3xl font-black text-gold">${stats.virtualBalance.toFixed(2)}</h3>
              <p className="text-xs text-gold/70 mt-1">Off-chain credit logic</p>
           </div>
           <div>
              <p className="text-sm text-gray-400 mb-1">Connected Network</p>
              <div className="flex flex-col">
                <span className="text-lg font-black text-emerald-400 uppercase">Binance Smart Chain</span>
                <span className="text-xs text-gray-500 font-mono">BEP20: {stats.walletAddress.slice(0,8)}...{stats.walletAddress.slice(-6)}</span>
              </div>
           </div>
        </div>

        {/* Deposit Card */}
        <div className="glassmorphism rounded-3xl p-6 md:p-8 lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ArrowDownToLine className="w-5 h-5 text-emerald-400" />
            Add Funds (USDT BEP20)
          </h2>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Deposit Amount (USD)</label>
              <input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-navy-light/50 border border-navy-border rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>
            <button disabled={isProcessing} className={`w-full py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isProcessing ? 'Processing... ' : 'Deposit Funds'}
            </button>
          </form>
        </div>

        {/* Withdraw Card */}
        <div className="glassmorphism rounded-3xl p-6 md:p-8 lg:col-span-2" id="withdraw-section">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ArrowUpFromLine className="w-5 h-5 text-rose-400" />
            Withdraw Funds
          </h2>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="flex justify-between text-sm mb-2">
               <span className="text-gray-400">Amount (USD)</span>
               <span className="text-gray-400">Available: <span className="text-white">${stats.availableBalance.toFixed(2)}</span></span>
            </div>
            <input 
              type="number" 
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Min $50"
              className="w-full bg-navy-light/50 border border-navy-border rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-rose-400 transition-colors mb-4"
            />
            <button disabled={isProcessing} className={`w-full py-4 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isProcessing ? 'Processing...' : 'Request Withdrawal'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">Connected Wallet: {stats.walletAddress.slice(0, 6)}...{stats.walletAddress.slice(-4)}</p>
          </form>
        </div>

        {/* P2P Username Transfer */}
        <div className="glassmorphism rounded-3xl p-6 md:p-8 lg:col-span-3 border border-neon-blue/30">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-neon-blue" />
            P2P Username Transfer
          </h2>
          <form onSubmit={handleTransfer} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
               <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Recipient Username</label>
               <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input required type="text" value={txUser} onChange={e=>setTxUser(e.target.value)} placeholder="username" className="w-full bg-navy border border-navy-border rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
               </div>
            </div>
            <div className="md:col-span-1">
               <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Amount ($)</label>
               <input required type="number" min="1" max={stats.availableBalance} value={txAmount} onChange={e=>setTxAmount(e.target.value)} placeholder="0.00" className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
            </div>
            <div className="md:col-span-1">
               <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">6-Digit PIN</label>
               <input required type="password" maxLength={6} value={txPin} onChange={e=>setTxPin(e.target.value)} placeholder="••••••" className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white text-center tracking-widest font-mono focus:outline-none focus:border-neon-blue" />
            </div>
            <div className="md:col-span-1 flex items-end">
               <button type="submit" disabled={isProcessing} className={`w-full py-3 h-[46px] bg-neon-blue border-neon-blue text-navy hover:bg-neon-blue-dark rounded-xl font-bold transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isProcessing ? '...' : 'Execute Transfer'}
               </button>
            </div>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glassmorphism rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-neon-blue" />
          Transaction History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-navy-border text-gray-400 text-sm">
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 font-medium">Hash</th>
              </tr>
            </thead>
            <tbody>
              {stats.transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-navy-border/50 text-sm">
                  <td className="py-4 pr-4">
                     <span className={`px-2 py-1 rounded inline-block text-[10px] uppercase font-bold tracking-wider
                        ${tx.type === 'deposit' ? 'bg-blue-500/10 text-blue-400' :
                          tx.type === 'withdraw' ? 'bg-rose-500/10 text-rose-400' :
                          tx.type === 'matrix_income' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-gray-500/10 text-gray-400'
                        }
                     `}>
                        {tx.type.replace('_', ' ')}
                     </span>
                  </td>
                  <td className="py-4 pr-4 font-mono font-bold text-white">
                     {tx.type === 'matrix_income' || tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-4 pr-4">
                     <span className={`flex items-center gap-1 ${tx.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {tx.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                        {tx.status}
                     </span>
                  </td>
                  <td className="py-4 pr-4 text-gray-400">
                     {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                     {tx.hash ? (
                        <span className="font-mono text-neon-blue">
                           {tx.hash.slice(0, 10)}...
                        </span>
                     ) : (
                        <span className="text-gray-600">-</span>
                     )}
                  </td>
                </tr>
              ))}
              {stats.transactions.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-8 text-center text-gray-500">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
