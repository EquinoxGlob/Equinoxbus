import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getBestReferral } from '../hooks/useReferralEngine';
import { Hexagon, Zap, Shield, ArrowRight, Wallet, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Landing() {
  const { connectWallet, getUserByUsername, getUserByWallet } = useAppContext();
  const [searchParams] = useSearchParams();
  const [showConnect, setShowConnect] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [address, setAddress] = useState('');
  const [sponsorId, setSponsorId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Real-time detection for UI display
  const [detectedRef, setDetectedRef] = useState<string | null>(null);

  useEffect(() => {
    // Poll just to update the UI if they arrive with a link
    let ref = getBestReferral();
    if (!ref) {
      const urlRef = searchParams.get('ref');
      if (urlRef) ref = urlRef.replace(/[^a-zA-Z0-9_-]/g, '');
    }
    if (ref) setDetectedRef(ref);
  }, [searchParams]);

  const handleWalletSubmit = () => {
    let walletToUse = address.trim();
    if (walletToUse.length < 10) {
      // Create a random wallet for testing new referrals to avoid colliding with crypto_king's wallet
      walletToUse = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    }
    
    // Check if the user already exists (LOGIN flow)
    const existingUser = getUserByWallet(walletToUse);
    // Also allow the root admin address to login directly
    if (existingUser || walletToUse === '0x71C...97d1') {
      connectWallet(walletToUse);
      return;
    }

    let ref = getBestReferral() || detectedRef;
    if (!ref) {
       const urlRef = searchParams.get('ref');
       if (urlRef) ref = urlRef.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    if (!ref) {
      setShowConnect(false);
      setShowSponsorModal(true); // Guardrail: Must have a sponsor to register
    } else {
      executeConnection(walletToUse, ref);
    }
  };

  const handleManualSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorId) return;
    
    let walletToUse = address.trim();
    if (walletToUse.length < 10) {
      walletToUse = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    }
    
    executeConnection(walletToUse, sponsorId);
  };

  const handleGlobalPoolJoin = () => {
    let walletToUse = address.trim();
    if (walletToUse.length < 10) {
      walletToUse = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    }
    executeConnection(walletToUse, 'admin_root'); // ID 1
  };

  const executeConnection = (walletToUse: string, sponsorRef: string) => {
    connectWallet(walletToUse, sponsorRef);
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col pt-32 items-center relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-neon-blue/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center z-10 px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-neon-blue/30 bg-neon-blue/10">
          <Zap className="w-4 h-4 text-neon-blue" />
          <span className="text-xs text-neon-blue font-bold tracking-[0.2em] uppercase">The Ultimate Matrix Dashboard</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-neon-blue mb-6 tracking-tight">
          NEXORA
        </h1>
        
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
          The ultimate decentralized 14-position community reward platform utilizing smart contracts on Web3. 
        </p>

        {detectedRef && (
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="inline-block mb-8 py-2 px-6 bg-gradient-to-r from-neon-blue/20 to-blue-500/10 border border-neon-blue/40 rounded-xl"
          >
             <p className="text-sm text-neon-blue font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Invited by Sponsor: <span className="text-white tracking-wider">{detectedRef}</span>
             </p>
          </motion.div>
        )}

        <div>
          <button
            onClick={() => setShowConnect(true)}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-neon-blue to-blue-600 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]"
          >
            <Wallet className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Connect Web3 Wallet
            <ArrowRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Defi & Smart Contracts", desc: "100% decentralized execution utilizing matrix systems" },
            { title: "14-Position Matrix", desc: "2 → 4 → 8 slot structure with dynamic spillovers" },
            { title: "Community Driven", desc: "Earn through royalty pools, course access, and networking" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 + 0.4 }}
              className="p-8 rounded-3xl glassmorphism text-left"
            >
              <Shield className="w-10 h-10 text-neon-blue mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {showConnect && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-navy-light border border-navy-border p-8 rounded-3xl w-full max-w-sm shadow-2xl relative"
            >
              <button onClick={() => setShowConnect(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-neon-blue" />
                Connect Wallet
              </h2>
              <div className="space-y-4">
                <button onClick={handleWalletSubmit} className="w-full p-4 flex items-center gap-4 bg-navy rounded-xl border border-navy-border hover:border-gold/50 hover:bg-gold/5 transition-colors">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">🦊</div>
                  <span className="font-semibold text-white">MetaMask</span>
                </button>
                <button onClick={handleWalletSubmit} className="w-full p-4 flex items-center gap-4 bg-navy rounded-xl border border-navy-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">🛡️</div>
                  <span className="font-semibold text-white">Trust Wallet</span>
                </button>
                <div className="pt-4 border-t border-navy-border">
                  <p className="text-xs text-gray-400 mb-2">Or connect via BEP20 Address manually:</p>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-navy border border-navy-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue mb-4"
                  />
                  <button onClick={handleWalletSubmit} className="w-full py-3 bg-neon-blue text-navy font-bold rounded-lg hover:bg-neon-blue-dark">
                    Connect Any Wallet
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setAddress('0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''))} className="flex-1 py-2 mt-4 bg-gray-500/10 text-gray-400 font-bold rounded-lg hover:bg-gray-500/20 text-xs">
                      Generate Random Test Wallet
                    </button>
                    <button onClick={() => { setAddress('0x71C...97d1'); }} className="flex-1 py-2 mt-4 bg-rose-500/10 text-rose-400 font-bold rounded-lg hover:bg-rose-500/20 text-xs text-center" title="Login as Master Admin">
                      Login as Master ID
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSponsorModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-navy border border-neon-blue/30 p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowSponsorModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4">
                    <UserPlus className="w-8 h-8 text-neon-blue" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                 <p className="text-gray-400 text-sm mb-6">Equinox Global is an invite-only collective. Enter a valid Sponsor Username or ID to join the network.</p>
              </div>

              {errorMsg && (
                 <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/50 text-rose-400 text-sm rounded-lg text-center">
                    {errorMsg}
                 </div>
              )}

              <form onSubmit={handleManualSponsorSubmit} className="space-y-4">
                <div>
                   <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Sponsor Username or ID</label>
                   <input required type="text" value={sponsorId} onChange={e=>setSponsorId(e.target.value)} placeholder="e.g. crypto_king" className="w-full bg-navy-light/50 border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
                </div>
                <button type="submit" className="w-full py-4 bg-neon-blue text-navy font-bold rounded-xl hover:bg-neon-blue-dark transition-colors shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                   Validate & Join Network
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-navy-border text-center">
                 <p className="text-xs text-gray-500 mb-3">No sponsor? Join the global spillover pool under the root contract.</p>
                 <button onClick={handleGlobalPoolJoin} className="text-sm font-bold text-gray-400 hover:text-white transition-colors underline decoration-gray-500 underline-offset-4">
                    Waitlist & Join Global Pool
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
