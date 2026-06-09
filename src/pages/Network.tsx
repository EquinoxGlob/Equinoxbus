import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Network as NetworkIcon, Users, UserPlus, Link, Copy, CheckCircle2, DollarSign, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRecord } from '../types';

export default function Network() {
  const { stats, adminData } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const referralLink = `${window.location.origin}/?ref=${stats.username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleNode = (username: string) => {
    setExpandedNodes(prev => ({ ...prev, [username]: !prev[username] }));
  };

  // Optimistic Tree Rendering with Adjacency List for O(1) Lookups
  const adjacencyMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    adminData.usersList.forEach(u => {
      const sponsor = u.sponsorId || 'none';
      if (!map[sponsor]) map[sponsor] = [];
      map[sponsor].push(u);
    });
    return map;
  }, [adminData.usersList]);

  // Build the dynamic relational tree mapping dynamically (lazy initialization)
  const buildTree = (sponsorUser: string, currentLevel: number): any => {
    if (currentLevel > 10) return null; // Lazy constraint
    
    const directs = adjacencyMap[sponsorUser] || [];
    
    return directs.map(direct => ({
       ...direct,
       children: buildTree(direct.username, currentLevel + 1) || []
    }));
  };

  const myNetworkTree = useMemo(() => {
    return buildTree(stats.username, 1);
  }, [adjacencyMap, stats.username]);


  // Recursively count total partners in network
  const countNetwork = (tree: any[]): number => {
    let count = 0;
    for (const node of tree) {
      count += 1 + countNetwork(node.children);
    }
    return count;
  };

  const totalPartners = useMemo(() => countNetwork(myNetworkTree), [myNetworkTree]);

  const renderNode = (node: any, level: number) => {
    const isExpanded = expandedNodes[node.username];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="w-full">
         <div 
            onClick={() => hasChildren && toggleNode(node.username)}
            className={`bg-navy-light/40 border ${hasChildren ? 'border-neon-blue/30 cursor-pointer hover:border-neon-blue' : 'border-navy-border'} rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors relative`}
            style={{ marginLeft: `${(level - 1) * 1.5}rem` }}
         >
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  {node.username.slice(0,2)}
               </div>
               <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                     @{node.username}
                     {hasChildren && (
                        isExpanded ? <ChevronDown className="w-4 h-4 text-neon-blue" /> : <ChevronRight className="w-4 h-4 text-gray-500" />
                     )}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-mono">
                     {node.wallet.slice(0,6)}...{node.wallet.slice(-4)}
                  </p>
               </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm w-full sm:w-auto justify-between sm:justify-start pt-4 sm:pt-0 border-t border-navy-border sm:border-t-0 p-2 sm:p-0">
               <div className="text-center">
                  <p className="text-gray-500 mb-1 text-[10px] uppercase tracking-widest font-bold">Directs</p>
                  <p className="font-bold text-white">{node.directsCount}</p>
               </div>
               <div className="text-center">
                  <p className="text-gray-500 mb-1 text-[10px] uppercase tracking-widest font-bold">Highest Slot</p>
                  <p className="font-bold text-neon-blue">S-{node.highestSlot}</p>
               </div>
            </div>
         </div>

          {/* Children Rendering (Lazy Loaded via isExpanded) */}
         <AnimatePresence>
            {isExpanded && hasChildren && (
               <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2 overflow-hidden flex flex-col relative before:content-[''] before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-navy-border"
               >
                  {node.children.map((child: any) => renderNode(child, level + 1))}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <NetworkIcon className="w-8 h-8 text-neon-blue" />
          Referral Network
        </h1>
        <p className="text-gray-400 mt-2">Grow your team and multiply your matrix spillovers</p>
      </header>

      {/* Link Card */}
      <div className="glassmorphism rounded-3xl p-6 md:p-8 mb-8 border border-neon-blue/30 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[80px] pointer-events-none" />
         
         <div className="relative z-10">
            <h2 className="text-lg font-bold text-white mb-4">Your Cryptographic Invite Link</h2>
            <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 bg-navy-light/80 border border-navy-border rounded-xl px-4 py-3 flex items-center gap-3">
                  <Link className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-300 font-mono text-sm sm:text-base hidden sm:inline">{referralLink}</span>
                  <span className="text-gray-300 font-mono text-sm sm:hidden truncate">{referralLink}</span>
               </div>
               <button 
                  onClick={handleCopy}
                  className="flex justify-center items-center gap-2 bg-neon-blue text-navy px-8 py-3 rounded-xl font-bold hover:bg-neon-blue-dark transition-colors"
               >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
               </button>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
               <span className="text-gray-400">Referral Tracker locked via LocalStorage constraints.</span>
            </div>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2 text-indigo-400"><Users className="w-5 h-5" /> Total In Network</div>
            <h3 className="text-3xl font-black text-white">{totalPartners}</h3>
         </div>
         <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2 text-emerald-400"><UserPlus className="w-5 h-5" /> Direct Team</div>
            <h3 className="text-3xl font-black text-white">{myNetworkTree.length}</h3>
         </div>
         <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2 text-neon-blue"><NetworkIcon className="w-5 h-5" /> Matrix Slots</div>
            <h3 className="text-3xl font-black text-white">12 <span className="text-sm text-gray-500 font-normal">Active</span></h3>
         </div>
         <div className="glassmorphism rounded-2xl p-6 border border-gold/30">
            <div className="flex items-center gap-2 mb-2 text-gold"><DollarSign className="w-5 h-5" /> Est. Network Rev</div>
            <h3 className="text-3xl font-black text-gold">${(totalPartners * 150).toLocaleString()}</h3>
         </div>
      </div>

      {/* Modern Tree UI */}
      <div className="glassmorphism rounded-3xl p-6 md:p-8 border border-neon-blue/20">
         <h2 className="text-xl font-bold text-white mb-6">Relational Tree Map</h2>
         <div className="space-y-3 relative">
            {myNetworkTree.length > 0 ? (
               myNetworkTree.map((node: any) => renderNode(node, 1))
            ) : (
               <div className="p-8 text-center border border-dashed border-navy-border rounded-2xl">
                  <p className="text-gray-500 text-sm">Your network tree is empty. Share your referral link to start growing your community matrix.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
