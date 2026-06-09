import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldAlert, Activity, Users, DollarSign, Database, Settings, Lock, CheckCircle2, TrendingUp, KeyRound, AlertCircle, Ban, ArrowRightLeft, MessageSquare, Network, ArrowUpFromLine, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { stats, adminData, generateVirtualFunds, transferVirtualFunds, adminActivateSlot, handleWithdrawalAction, adjustNFTFloor, collectAdminFees, toggleUserStatus, publishAnnouncement } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics'|'users'|'funds'|'treasury'|'utilities'|'withdrawals'>('analytics');
  
  // Forms State
  const [genAmount, setGenAmount] = useState('');
  const [genPin, setGenPin] = useState('');
  const [txUser, setTxUser] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txPin, setTxPin] = useState('');
  const [activationUser, setActivationUser] = useState('');
  const [activationSlot, setActivationSlot] = useState('');
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'} | null>(null);
  const [newFloor, setNewFloor] = useState(stats.nftMarketValue.toString());
  const [announcementInput, setAnnouncementInput] = useState('');

  const showMsg = (text: string, type: 'success'|'error') => {
    setMessage({text, type});
    setTimeout(() => setMessage(null), 4000);
  };

  const handleManualActivation = (e: React.FormEvent) => {
    e.preventDefault();
    const slotId = parseInt(activationSlot);
    if (isNaN(slotId) || slotId < 1 || slotId > 12) {
      showMsg('Slot ID must be between 1 and 12', 'error');
      return;
    }
    const { success, message: msg } = adminActivateSlot(activationUser, slotId);
    if (success) {
      showMsg(msg, 'success');
      setActivationUser('');
      setActivationSlot('');
    } else {
      showMsg(msg, 'error');
    }
  };

  if (!stats.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glassmorphism p-12 text-center rounded-3xl border border-rose-500/30 max-w-md w-full relative overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.1)]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
           <Lock className="w-20 h-20 text-rose-500 mx-auto mb-6" />
           <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">Root Access Only</h2>
           <p className="text-gray-400 mb-8">
             Your connected wallet ({stats.walletAddress.slice(0,6)}...) does not have Master ID 1 permissions.
           </p>
           <button onClick={() => navigate('/')} className="px-8 py-4 bg-navy-light/80 border border-navy-border hover:border-white/20 text-white font-bold rounded-xl transition-all w-full">
             Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  const handleGenFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const success = generateVirtualFunds(parseFloat(genAmount), genPin);
    if (success) {
      showMsg(`Successfully minted $${genAmount} of Virtual Credit.`, 'success');
      setGenAmount(''); setGenPin('');
    } else {
      showMsg('Invalid Master PIN.', 'error');
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const success = transferVirtualFunds(txUser, parseFloat(txAmount), txPin);
    if (success) {
      showMsg(`Successfully transferred $${txAmount} to ${txUser}.`, 'success');
      setTxUser(''); setTxAmount(''); setTxPin('');
    } else {
      showMsg('Invalid PIN or Insufficient Virtual Credit.', 'error');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-widest uppercase text-gold flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            <ShieldAlert className="w-8 h-8" />
            Global Command Center
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm">Auth Level: Root Owner (ID 1) | Connected: {stats.walletAddress}</p>
        </div>
        <div className="glassmorphism rounded-full px-6 py-3 border border-gold/30 text-gold font-bold flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
           System Active
        </div>
      </header>

      {message && (
        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </motion.div>
      )}

      {/* Custom Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 hide-scrollbar">
        {[
          { id: 'analytics', icon: Activity, label: 'Analytics' },
          { id: 'users', icon: Users, label: 'User Matrix' },
          { id: 'funds', icon: DollarSign, label: 'Virtual Money' },
          { id: 'withdrawals', icon: ArrowUpFromLine, label: 'Withdrawals' },
          { id: 'treasury', icon: Database, label: 'Treasury' },
          { id: 'utilities', icon: Settings, label: 'System Utils' }
        ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all ${
               activeTab === tab.id ? 'bg-gold/10 border border-gold/50 text-gold shadow-[0_0_15px_rgba(255,215,0,0.15)]' : 'bg-navy-light border border-navy-border text-gray-500 hover:text-white hover:bg-white/5'
             }`}
           >
             <tab.icon className="w-5 h-5" />
             {tab.label}
           </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
        >
          
          {/* A. GLOBAL ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glassmorphism p-6 rounded-2xl border border-neon-blue/20">
                     <p className="text-sm text-gray-400 mb-2">Total Global Users</p>
                     <h3 className="text-3xl font-black text-white">{adminData.totalUsers.toLocaleString()}</h3>
                     <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +{adminData.dailyGrowth} today</p>
                  </div>
                  <div className="glassmorphism p-6 rounded-2xl border border-gold/20">
                     <p className="text-sm text-gray-400 mb-2">ID 1 Net Revenue</p>
                     <h3 className="text-3xl font-black text-gold">${adminData.id1Revenue.toLocaleString()}</h3>
                     <p className="text-xs text-gray-500 mt-2">Passups & Recycles combined</p>
                  </div>
                  <div className="glassmorphism p-6 rounded-2xl">
                     <p className="text-sm text-gray-400 mb-2">Total System Volume</p>
                     <h3 className="text-3xl font-black text-white">${adminData.totalVolume.toLocaleString()}</h3>
                  </div>
                  <div className="glassmorphism p-6 rounded-2xl">
                     <p className="text-sm text-gray-400 mb-2">Royal Pool Escrow</p>
                     <h3 className="text-3xl font-black text-white">${stats.royalPool.toLocaleString()}</h3>
                  </div>
               </div>
               <div className="glassmorphism rounded-3xl p-8 h-96 flex flex-col justify-center items-center border border-navy-border relative">
                  <h3 className="absolute top-8 left-8 text-xl font-bold text-white">Slot Density Distribution</h3>
                  {/* Mock Chart */}
                  <div className="w-full h-48 flex items-end justify-between px-8 gap-2">
                     {[100, 80, 75, 60, 45, 30, 20, 15, 10, 5, 2, 1].map((val, i) => (
                        <div key={i} className="w-full bg-gradient-to-t from-neon-blue/50 to-neon-blue hover:from-gold hover:to-yellow-200 transition-colors rounded-t-sm group relative" style={{height: `${val}%`}}>
                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400 opacity-0 group-hover:opacity-100">{val}%</div>
                        </div>
                     ))}
                  </div>
                  <div className="w-full flex justify-between px-8 mt-4 text-xs font-mono text-gray-500">
                     {Array.from({length:12}).map((_,i) => <span key={i}>S{i+1}</span>)}
                  </div>
               </div>
            </div>
          )}

          {/* B. USERS & MATRIX */}
          {activeTab === 'users' && (
            <div className="glassmorphism rounded-3xl p-6 md:p-8">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                  <h3 className="text-xl font-bold text-white">Directory & State Control</h3>
                  <div className="flex gap-2 w-full md:w-96">
                     <input type="text" placeholder="Search by Username or Wallet..." className="flex-1 bg-navy border border-navy-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-neon-blue" />
                     <button className="bg-navy-light border border-navy-border px-4 py-2 rounded-xl text-white font-bold hover:bg-white/5">Search</button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-navy-border text-gray-400 text-sm">
                           <th className="pb-4 pr-4 font-medium">Username</th>
                           <th className="pb-4 pr-4 font-medium">Wallet Addr</th>
                           <th className="pb-4 pr-4 font-medium">Highest Slot</th>
                           <th className="pb-4 pr-4 font-medium">Status</th>
                           <th className="pb-4 font-medium text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {adminData.usersList.map((u) => (
                           <tr key={u.id} className="border-b border-navy-border/50">
                              <td className="py-4 pr-4 font-bold text-white">@{u.username}</td>
                              <td className="py-4 pr-4 font-mono text-gray-400 text-sm">{u.wallet}</td>
                              <td className="py-4 pr-4 text-neon-blue font-bold">Slot {u.highestSlot}</td>
                              <td className="py-4 pr-4">
                                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.status==='active'?'bg-emerald-500/10 text-emerald-400':'bg-red-500/10 text-red-500'}`}>
                                    {u.status}
                                 </span>
                              </td>
                              <td className="py-4 text-right flex justify-end gap-2">
                                 <button className="p-2 bg-navy-light rounded hover:bg-white/10 text-gray-300 transition-colors" title="View Matrix"><Network className="w-4 h-4" /></button>
                                 <button onClick={() => toggleUserStatus(u.id)} className={`p-2 rounded transition-colors ${u.status==='active'?'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white':'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`} title={u.status==='active'?'Freeze Account':'Unfreeze Account'}>
                                    <Ban className="w-4 h-4" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* C. VIRTUAL MONEY SYSTEM */}
          {activeTab === 'funds' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glassmorphism p-8 rounded-3xl border border-gold/30">
                  <h3 className="text-xl font-bold text-gold mb-6 flex items-center gap-2">
                     <KeyRound className="w-5 h-5" /> Virtual Fund Generator
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">Create off-chain credit to distribute to global leaders manually.</p>
                  
                  <div className="mb-6 p-4 bg-navy-light/50 border border-navy-border rounded-xl">
                     <span className="text-sm text-gray-500">Current Virtual Reserve</span>
                     <div className="text-3xl font-black text-white font-mono">${adminData.virtualCreditBalance.toLocaleString()}</div>
                  </div>

                  <form onSubmit={handleGenFunds} className="space-y-4">
                     <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Amount (USDT)</label>
                        <input required type="number" min="1" value={genAmount} onChange={e=>setGenAmount(e.target.value)} className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
                     </div>
                     <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">6-Digit Admin PIN</label>
                        <input required type="password" maxLength={6} value={genPin} onChange={e=>setGenPin(e.target.value)} placeholder="••••••" className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white text-center tracking-widest font-mono focus:outline-none focus:border-gold" />
                     </div>
                     <button type="submit" className="w-full py-4 bg-gold/10 border border-gold/50 text-gold hover:bg-gold hover:text-navy rounded-xl font-bold transition-all">
                        Mint Virtual Credit
                     </button>
                  </form>
               </div>

               <div className="space-y-6">
                 <div className="glassmorphism p-8 rounded-3xl border border-neon-blue/30">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                       <ArrowRightLeft className="w-5 h-5 text-neon-blue" /> P2P Username Transfer
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">Send valid credit directly to a user's dashboard balance.</p>

                    <form onSubmit={handleTransfer} className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Recipient Username</label>
                            <div className="relative">
                               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                               <input required type="text" value={txUser} onChange={e=>setTxUser(e.target.value)} className="w-full bg-navy border border-navy-border rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
                            </div>
                         </div>
                         <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Amount</label>
                            <input required type="number" min="1" max={adminData.virtualCreditBalance} value={txAmount} onChange={e=>setTxAmount(e.target.value)} className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
                         </div>
                       </div>
                       <div>
                          <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">6-Digit Admin PIN</label>
                          <input required type="password" maxLength={6} value={txPin} onChange={e=>setTxPin(e.target.value)} placeholder="••••••" className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white text-center tracking-widest font-mono focus:outline-none focus:border-neon-blue" />
                       </div>
                       <button type="submit" className="w-full py-4 bg-neon-blue border-neon-blue text-navy hover:bg-neon-blue-dark rounded-xl font-bold transition-all">
                          Execute Secure Transfer
                       </button>
                    </form>
                 </div>

                 <div className="glassmorphism p-8 rounded-3xl border border-emerald-500/30">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                       <Lock className="w-5 h-5 text-emerald-400" /> Manual ID Activation
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">Activate a specific slot for a user by deducting from Virtual Reserve.</p>
                    <form onSubmit={handleManualActivation} className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">User ID / Username</label>
                            <input required type="text" value={activationUser} onChange={e=>setActivationUser(e.target.value)} className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                         </div>
                         <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Target Slot (1-12)</label>
                            <input required type="number" min="1" max="12" value={activationSlot} onChange={e=>setActivationSlot(e.target.value)} className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                         </div>
                       </div>
                       <button type="submit" className="w-full py-4 bg-emerald-500 border border-emerald-500 text-navy hover:bg-emerald-600 rounded-xl font-bold transition-all">
                          Force Activate Slot
                       </button>
                    </form>
                 </div>
               </div>
            </div>
          )}

          {/* C.5 WITHDRAWALS */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-6">
              <div className="glassmorphism p-6 md:p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ArrowUpFromLine className="w-5 h-5 text-neon-blue" />
                  Hybrid Withdrawal Requests
                </h3>
                <div className="overflow-x-auto hide-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-gray-400 text-sm border-b border-navy-border/50">
                        <th className="pb-3 font-medium">User</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {adminData.pendingWithdrawals.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No withdrawal requests found.
                          </td>
                        </tr>
                      ) : (
                        adminData.pendingWithdrawals.map(req => (
                           <tr key={req.id} className="border-b border-navy-border/30 hover:bg-white/[0.02] transition-colors">
                            <td className="py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-white">@{req.username}</span>
                                <span className="text-xs text-gray-500">{req.walletAddress.slice(0,6)}...{req.walletAddress.slice(-4)}</span>
                              </div>
                            </td>
                            <td className="py-4 font-mono font-bold text-emerald-400">
                              ${req.amount.toFixed(2)}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                req.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="py-4 text-gray-400">
                              {new Date(req.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 text-right">
                              {req.status === 'pending' ? (
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => {
                                      const res = handleWithdrawalAction(req.id, 'approve');
                                      showMsg(res.message, res.success ? 'success' : 'error');
                                    }}
                                    className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                                    title="Approve & Disburse Crypto (20% Fee)"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const res = handleWithdrawalAction(req.id, 'reject');
                                      showMsg(res.message, res.success ? 'success' : 'error');
                                    }}
                                    className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                                    title="Reject & Force P2P Transfer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-600">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* D. TREASURY (NFT & ROYAL POOL) */}
          {activeTab === 'treasury' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glassmorphism p-8 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-2">Royal Pool Escrow</h3>
                  <p className="text-sm text-gray-400 mb-8">Manage the global community liquidity pool.</p>
                  
                  <div className="text-5xl font-black font-mono text-gold mb-8">${stats.royalPool.toLocaleString()}</div>
                  <button onClick={() => { collectAdminFees(); showMsg('Withdrew 15% Platform Maintenance Fee to Admin Wallet.', 'success');}} className="w-full py-4 bg-gold/10 border-gold/30 border text-gold hover:bg-gold hover:text-navy rounded-xl font-bold transition-all">
                     Withdraw 15% Admin Fee
                  </button>
               </div>

               <div className="glassmorphism p-8 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-2">NFT Floor Price Control</h3>
                  <p className="text-sm text-gray-400 mb-8">Override the displayed value of the Welcome Pass NFT.</p>
                  
                  <div className="mb-8">
                     <span className="text-2xl font-bold font-mono text-emerald-400">${stats.nftMarketValue.toFixed(2)}</span>
                     <span className="text-gray-500 text-sm ml-2">Current Active Price</span>
                  </div>
                  
                  <div className="flex gap-4">
                     <input type="number" value={newFloor} onChange={e=>setNewFloor(e.target.value)} className="flex-1 bg-navy border border-navy-border rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-neon-blue" />
                     <button onClick={() => { adjustNFTFloor(parseFloat(newFloor)); showMsg('NFT Floor Price Updated Successfully.', 'success'); }} className="px-6 bg-neon-blue text-navy font-bold rounded-xl hover:bg-neon-blue-dark transition-colors">
                        Set Value
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* E. UTILITIES */}
          {activeTab === 'utilities' && (
            <div className="space-y-6">
               <div className="glassmorphism p-8 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <MessageSquare className="w-5 h-5 text-neon-blue" /> Global Marquee Announcement
                  </h3>
                  <div className="flex gap-4">
                     <input type="text" value={announcementInput} onChange={e=>setAnnouncementInput(e.target.value)} placeholder="Type a global message to flash on all dashboards..." className="flex-1 bg-navy border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
                     <button onClick={() => { publishAnnouncement(announcementInput); setAnnouncementInput(''); showMsg('Global broadcast active.', 'success'); }} className="px-8 bg-neon-blue text-navy font-bold rounded-xl hover:bg-neon-blue-dark transition-colors">
                        Broadcast Now
                     </button>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-navy-light/50 border border-navy-border flex justify-between items-center text-sm">
                     <span className="text-gray-400">Current Status: <strong className="text-white ml-2">{adminData.announcement || 'No active announcement'}</strong></span>
                     <button onClick={() => publishAnnouncement('')} className="text-rose-400 hover:underline">Clear Announcement</button>
                  </div>
               </div>
               
               <div className="glassmorphism p-8 rounded-3xl">
                   <h3 className="text-xl font-bold text-white mb-6">Internal Transaction Ledger</h3>
                   {/* Simplified mock ledger for admin view */}
                   <div className="p-8 text-center text-gray-500 border border-dashed border-navy-border rounded-xl">
                      Ledger History is syncing securely with the Blockchain Explorer API. <br/> Check back shortly.
                   </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
