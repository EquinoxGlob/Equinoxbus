import { useAppContext } from '../context/AppContext';
import { User, Copy, Mail, LogOut, CheckCircle2, Save, X } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const { stats, disconnectWallet, updateUserProfile } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: stats.name, username: stats.username, email: stats.email });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updateUserProfile(editForm.name, editForm.username, editForm.email);
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <User className="w-8 h-8 text-neon-blue" />
          My Profile
        </h1>
      </header>

      <div className="glassmorphism rounded-3xl p-8 relative overflow-hidden flex flex-col items-center md:items-start">
         <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-[80px]" />
         
         <div className="flex flex-col md:flex-row items-center md:items-start gap-8 z-10 relative w-full">
            <div className="w-32 h-32 rounded-full border-4 border-neon-blue/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.2)] bg-gradient-to-br from-navy to-navy-light shrink-0">
               <span className="text-5xl font-black text-neon-blue">{stats.name.charAt(0)}</span>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4 w-full">
               {!isEditing ? (
                 <>
                   <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{stats.name}</h2>
                      <p className="text-emerald-400 font-bold tracking-widest text-sm uppercase">{stats.rank} Rank Member</p>
                   </div>
                   
                   <div className="space-y-3 bg-navy-light/50 p-4 rounded-xl border border-navy-border max-w-lg mx-auto md:mx-0">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-400 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                         <span className="text-white font-medium">{stats.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-400 flex items-center gap-2"><User className="w-4 h-4" /> Username</span>
                         <span className="text-white font-medium">@{stats.username}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-400 flex items-center gap-2">Wallet</span>
                         <div className="flex items-center gap-2 bg-navy px-2 py-1 rounded cursor-pointer hover:bg-navy-border/50 transition-colors" onClick={() => handleCopy(stats.walletAddress)}>
                            <span className="text-gray-300 font-mono text-xs">{stats.walletAddress.slice(0,6)}...{stats.walletAddress.slice(-4)}</span>
                            {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-500" />}
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-lg mx-auto md:mx-0">
                      <button onClick={() => setIsEditing(true)} className="flex-1 py-3 bg-navy-light text-white border border-navy-border hover:border-neon-blue/50 rounded-xl font-bold transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                         Edit Profile
                      </button>
                      <button onClick={disconnectWallet} className="flex-1 py-3 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                         <LogOut className="w-4 h-4" /> Logout
                      </button>
                   </div>
                 </>
               ) : (
                 <div className="bg-navy-light/50 p-6 rounded-2xl border border-neon-blue/30 max-w-lg mx-auto md:mx-0 w-full space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block text-left">Display Name</label>
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block text-left">Username</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                         <input type="text" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} className="w-full bg-navy border border-navy-border rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block text-left">Email Address</label>
                      <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-navy border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue" />
                    </div>

                    <div className="flex gap-4 pt-2">
                       <button onClick={handleSave} className="flex-1 py-3 bg-neon-blue text-navy hover:bg-neon-blue-dark rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                          <Save className="w-4 h-4" /> Save
                       </button>
                       <button onClick={() => { setIsEditing(false); setEditForm({ name: stats.name, username: stats.username, email: stats.email }) }} className="py-3 px-4 bg-navy-light text-gray-400 hover:text-white border border-navy-border rounded-xl font-bold transition-all">
                          Cancel
                       </button>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
