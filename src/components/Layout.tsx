import { ReactNode, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Crown, Network, Wallet, BookOpen, User, Settings, ShieldAlert, Menu, X, LogOut, Bell, HelpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

function NavItem({ to, icon: Icon, label, isMobile = false, isGold = false, onClick }: { to: string, icon: any, label: string, isMobile?: boolean, isGold?: boolean, key?: string, onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex ${isMobile ? 'flex-col items-center justify-center p-2' : 'flex-row items-center gap-3 px-4 py-3 rounded-xl'}
        transition-all duration-300
        ${isActive 
          ? (isMobile ? (isGold ? 'text-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]') 
                      : (isGold ? 'bg-gold/10 text-gold font-bold border border-gold/30 shadow-[0_0_15px_rgba(255,215,0,0.15)]' 
                                : 'bg-neon-blue/10 text-neon-blue font-bold border border-neon-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]')) 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <Icon className={`${isMobile ? 'w-5 h-5 mb-1' : 'w-5 h-5'} ${isActive && isGold ? 'text-gold' : ''}`} />
          <span className={`${isMobile ? 'text-[10px] font-medium' : 'text-sm'}`}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { isConnected, stats, disconnectWallet, theme, updateTheme } = useAppContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isConnected && location.pathname === '/') {
    // If not connected, App.tsx will show Landing anyway, but let's be safe.
  }

  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/membership', icon: Crown, label: 'Membership' },
    { to: '/network', icon: Network, label: 'Network' },
    { to: '/community', icon: Crown, label: 'Community' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/courses', icon: BookOpen, label: 'Courses' },
  ];

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col md:flex-row font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-navy-border bg-navy-light/30 backdrop-blur-md p-4 sticky top-0 h-screen z-50">
        <div className="flex items-center gap-3 px-2 mb-10 mt-4">
          <div className="w-8 h-8 rounded bg-neon-blue flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <span className="font-black text-navy text-xl leading-none">E</span>
          </div>
          <div>
             <h1 className="text-xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">EQUINOX</h1>
             <p className="text-[10px] text-neon-blue tracking-widest opacity-80 uppercase">Ultimate Matrix</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {items.map(item => <NavItem key={item.to} {...item} />)}
          {stats.isAdmin && <NavItem to="/admin" icon={ShieldAlert} label="Root Admin" isGold={true} />}
        </nav>

        <div className="mt-auto border-t border-navy-border pt-4 flex flex-col gap-2">
          <NavItem to="/profile" icon={User} label="Profile" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 min-h-screen overflow-x-hidden relative">
         <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[150px] pointer-events-none" />
         <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
         
         <div className="relative z-10 w-full h-full min-h-screen">
            {stats.announcement && (
               <div className="w-full bg-neon-blue/10 border-b border-neon-blue/30 text-neon-blue px-4 py-2 text-center text-xs font-bold tracking-widest uppercase">
                  Global Announcement: {stats.announcement}
               </div>
            )}
            {children}
         </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-navy-light/90 backdrop-blur-xl border-t border-navy-border z-40 px-2 py-2 flex justify-between safe-area-bottom">
        {[items[0], items[1], items[2], items[4]].map(item => (
          <NavItem key={item.to} {...item} isMobile={true} />
        ))}
        {stats.isAdmin && <NavItem to="/admin" icon={ShieldAlert} label="Admin" isMobile={true} isGold={true} />}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </nav>

      {/* Mobile Drawer Navigation (3 lines menu) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm h-full bg-navy border-r border-navy-border flex flex-col pt-12 pb-6 px-4 animate-in slide-in-from-left duration-300">
             <button 
               onClick={() => setIsMobileMenuOpen(false)}
               className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
             >
               <X className="w-6 h-6" />
             </button>

             <div className="mb-8 px-4">
                <div className="w-16 h-16 rounded-full bg-navy-light border-2 border-neon-blue flex items-center justify-center text-xl font-black text-neon-blue mb-4">
                  {stats.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white">{stats.name}</h3>
                <p className="text-sm text-gray-400">@{stats.username}</p>
             </div>

             <div className="flex-1 overflow-y-auto space-y-2">
                <NavItem to="/profile" icon={User} label="My Profile" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/wallet" icon={Wallet} label="Wallet Details" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/courses" icon={BookOpen} label="Courses" onClick={() => setIsMobileMenuOpen(false)} />
                <NavItem to="/community" icon={Crown} label="Community" onClick={() => setIsMobileMenuOpen(false)} />
                
                <div className="my-4 border-t border-navy-border/50" />
                
                <NavItem to="/settings" icon={Settings} label="Security & Notifications" onClick={() => setIsMobileMenuOpen(false)} />
                
                <div className="my-4 border-t border-navy-border/50" />
                
                <a href="https://t.me/EquinoxSupport" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm">Help & Support</span>
                </a>
             </div>

             <div className="mt-auto px-2 space-y-4 pt-4 border-t border-navy-border/50">
               <div className="flex items-center justify-between px-4 py-3">
                 <span className="text-sm font-medium text-gray-400">Theme</span>
                 <div 
                   onClick={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
                   className={`w-12 h-6 rounded-full relative cursor-pointer px-1 flex items-center transition-colors ${theme === 'dark' ? 'bg-neon-blue justify-end' : 'bg-gray-500 justify-start'}`} 
                   title={theme === 'dark' ? 'Dark Mode active' : 'Light Mode active'}
                 >
                    <div className="w-4 h-4 bg-navy rounded-full shadow-md"></div>
                 </div>
               </div>

               <button onClick={() => { setIsMobileMenuOpen(false); disconnectWallet(); }} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all font-bold">
                 <LogOut className="w-5 h-5" />
                 <span className="text-sm">Logout</span>
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
