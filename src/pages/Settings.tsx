import { useAppContext } from '../context/AppContext';
import { Settings as SettingsIcon, Bell, Shield, Moon, Sun, Globe, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { stats, updateUserPin, theme, updateTheme, notifications, toggleNotification } = useAppContext();
  const [pin, setPin] = useState(stats.pin || '');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSavePin = () => {
    if (pin.length !== 6 || isNaN(Number(pin))) {
      setMessage({ text: 'PIN must be exactly 6 digits', type: 'error' });
      return;
    }
    updateUserPin(pin);
    setMessage({ text: 'Security PIN updated successfully', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };
  
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-neon-blue" />
          Settings & Security
        </h1>
        <p className="text-gray-400 mt-2">Manage your account preferences, security PIN, and alerts.</p>
      </header>

      {message && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
         {/* Theme */}
         <div className="glassmorphism p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white">Theme & Appearance</h3>
                  <p className="text-sm text-gray-400">Toggle between Dark and Light mode (Premium Dark by default).</p>
               </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-navy-light/50 rounded-xl border border-navy-border">
               <span className="font-medium text-white">{theme === 'dark' ? 'Dark Mode' : 'Light Mode (Preview)'}</span>
               <div 
                  onClick={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`w-12 h-6 rounded-full relative cursor-pointer flex items-center px-1 transition-colors ${theme === 'dark' ? 'bg-neon-blue justify-end' : 'bg-gray-500 justify-start'}`}
               >
                  <div className="w-4 h-4 bg-navy rounded-full shadow-md"></div>
               </div>
            </div>
         </div>

         {/* Security & PIN */}
         <div className="glassmorphism p-6 rounded-2xl border border-gold/30">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-gold" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white">Security & Transaction PIN</h3>
                  <p className="text-sm text-gray-400">Set or change your 6-digit PIN used for virtual fund transfers.</p>
               </div>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Enter Current / New PIN</label>
                  <input 
                     type="password" 
                     maxLength={6} 
                     value={pin}
                     onChange={(e) => setPin(e.target.value)}
                     placeholder="••••••" 
                     className="w-full sm:max-w-xs bg-navy border border-navy-border rounded-xl px-4 py-3 text-white tracking-widest font-mono focus:outline-none focus:border-gold" 
                  />
               </div>
               <button onClick={handleSavePin} className="px-6 py-3 bg-gold/10 border border-gold/50 text-gold hover:bg-gold hover:text-navy rounded-xl font-bold transition-all">
                  Save 6-Digit PIN
               </button>
            </div>
            
            <div className="mt-8 space-y-2 border-t border-navy-border pt-6">
               <div className="flex items-center justify-between p-4 bg-navy-light/50 rounded-xl border border-navy-border">
                  <span className="font-medium text-white">Two-Factor Authentication (2FA)</span>
                  <div className="w-12 h-6 bg-navy rounded-full relative cursor-pointer pl-1 flex items-center">
                     <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  </div>
               </div>
               <div className="flex items-center justify-between p-4 bg-navy-light/50 rounded-xl border border-navy-border">
                  <span className="font-medium text-white">Login Alerts</span>
                  <div className="w-12 h-6 bg-neon-blue rounded-full relative cursor-pointer pr-1 flex items-center justify-end">
                     <div className="w-4 h-4 bg-navy rounded-full shadow-md"></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Notifications */}
         <div className="glassmorphism p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-rose-400" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white">System Notifications</h3>
                  <p className="text-sm text-gray-400">Manage alerts like "Your Slot 3 is Recycled!"</p>
               </div>
            </div>
            <div className="space-y-2">
               {[
                  { key: 'recycled', label: '"Slot Recycled!" Alerts' },
                  { key: 'spillover', label: 'Spillover Receive Alerts' },
                  { key: 'teamJoin', label: 'Team Join Alerts' },
                  { key: 'newCourse', label: 'New Course Added' }
               ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-navy-light/50 rounded-xl border border-navy-border">
                     <span className="font-medium text-white">{item.label}</span>
                     <div 
                        onClick={() => toggleNotification(item.key)}
                        className={`w-12 h-6 rounded-full relative cursor-pointer flex items-center px-1 transition-colors ${notifications[item.key] ? 'bg-neon-blue justify-end' : 'bg-gray-500 justify-start'}`}
                     >
                        <div className="w-4 h-4 bg-navy rounded-full shadow-md"></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Language */}
         <div className="glassmorphism p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white">Language</h3>
               </div>
            </div>
            <select className="w-full sm:max-w-xs bg-navy-light/50 border border-navy-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue">
               <option value="en">English (US)</option>
               <option value="es">Español</option>
               <option value="hi">हिन्दी</option>
            </select>
         </div>
         
      </div>
    </div>
  );
}
