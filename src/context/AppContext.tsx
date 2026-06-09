import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Slot, UserStats, Transaction, AdminData, UserRecord } from '../types';

interface AppContextType {
  isConnected: boolean;
  connectWallet: (address: string, sponsorId?: string) => void;
  disconnectWallet: () => void;
  stats: UserStats;
  slots: Slot[];
  activeSlotId: number;
  setActiveSlotId: (id: number) => void;
  simulateFill: () => void;
  depositFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
  adminData: AdminData;
  publishAnnouncement: (msg: string) => void;
  generateVirtualFunds: (amount: number, pin: string) => boolean;
  transferVirtualFunds: (username: string, amount: number, pin: string) => boolean;
  updateUserPin: (newPin: string) => void;
  userTransferVirtualFunds: (username: string, amount: number, pin: string) => { success: boolean; message: string; targetWallet?: string };
  getUserByUsername: (username: string) => UserRecord | undefined;
  getUserByWallet: (wallet: string) => UserRecord | undefined;
  adminActivateSlot: (userId: string, slotId: number) => { success: boolean; message: string };
  handleWithdrawalAction: (reqId: string, action: 'approve' | 'reject') => { success: boolean; message: string };
  adjustNFTFloor: (newPrice: number) => void;
  collectAdminFees: () => void;
  toggleUserStatus: (userId: string) => void;
  updateUserProfile: (name: string, username: string, email: string) => void;
  updateTheme: (theme: 'dark' | 'light') => void;
  toggleNotification: (key: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const COSTS = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400];

const INITIAL_SLOTS: Slot[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  cost: COSTS[i],
  locked: i > 0, 
  cycle: 1,
  filledPositions: 0,
}));

const INITIAL_USERS: UserRecord[] = [
  { id: '1', username: 'admin_root', wallet: '0x71C...97d1', sponsorId: '', directsCount: 0, highestSlot: 1, status: 'active', joinedAt: new Date().toISOString(), balance: 0, transactions: [], downline: [] }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('equinox_is_connected');
      return saved === 'true';
    } catch (e) { return false; }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('equinox_user_stats');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
             ...parsed,
             availableBalance: parsed.availableBalance || 0,
             totalDeposits: parsed.totalDeposits || 0,
             rank: parsed.rank || 'Starter'
          };
        } catch (e) {}
      }
    } catch (e) {}
    return {
      availableBalance: 0,
      totalEarnings: 0,
      totalDeposits: 0,
      pendingWithdrawals: 0,
      virtualBalance: 0,
      royalPool: 15000,
      nftMarketValue: 150.0,
      walletAddress: '',
      name: 'Nexora User',
      username: 'nexora_user',
      email: 'user@nexora.network',
      pin: '',
      referralCode: 'EQNX-8X94T',
      sponsorId: 'admin_root',
      directTeam: 0,
      transactions: [],
      rank: 'Starter',
      isAdmin: false
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('equinox_user_stats', JSON.stringify(stats));
    } catch (e) {
      console.warn("localStorage blocks fallback - cached stats in memory", e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('equinox_is_connected', isConnected.toString());
    } catch (e) {
      console.warn("localStorage blocks fallback - cached connection in memory", e);
    }
  }, [isConnected]);
  
  const [adminData, setAdminData] = useState<AdminData>(() => {
    try {
      const saved = localStorage.getItem('equinox_admin_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure backwards compatibility with newly added fields
          if (parsed.usersList) {
            parsed.usersList = parsed.usersList.map((u: any) => ({
              ...u,
              balance: u.balance || 0,
              transactions: u.transactions || [],
              downline: u.downline || []
            }));
          } else {
            parsed.usersList = INITIAL_USERS;
          }
          if (!parsed.pendingWithdrawals) {
            parsed.pendingWithdrawals = [];
          }
          return parsed;
        } catch (e) {
          // Corrupted data, fallback to initial
        }
      }
    } catch (e) {}
    return {
      totalUsers: 1402,
      dailyGrowth: 45,
      totalVolume: 560000,
      id1Revenue: 125000,
      virtualCreditBalance: 0,
      announcement: 'Welcome to Nexora Network! System operating perfectly.',
      usersList: INITIAL_USERS,
      pendingWithdrawals: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('equinox_admin_data', JSON.stringify(adminData));
    } catch (e) {
      console.warn("localStorage blocks fallback - cached adminData in memory", e);
    }
  }, [adminData]);

  const [slots, setSlots] = useState<Slot[]>(() => {
    try {
      const saved = localStorage.getItem('equinox_slots');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    } catch (e) {}
    return INITIAL_SLOTS;
  });

  const [activeSlotId, setActiveSlotId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('equinox_active_slot');
      if (saved) {
        return parseInt(saved, 10);
      }
    } catch (e) {}
    return 1;
  });

  useEffect(() => {
    try {
      localStorage.setItem('equinox_slots', JSON.stringify(slots));
    } catch (e) {
      console.warn("localStorage blocks fallback - cached slots in memory", e);
    }
  }, [slots]);

  useEffect(() => {
    try {
      localStorage.setItem('equinox_active_slot', activeSlotId.toString());
    } catch (e) {
      console.warn("localStorage blocks fallback - cached active slot in memory", e);
    }
  }, [activeSlotId]);

  // System Polling Optimization & Memory Cleanup
  useEffect(() => {
    const handleNetworkChange = () => {
      // Simulate reconnect hydration
      console.log('Hydrating state on network re-connect...');
    };
    
    window.addEventListener('online', handleNetworkChange);
    
    // Explicit return cleans up active listeners when AppContext unmounts
    return () => {
      window.removeEventListener('online', handleNetworkChange);
    };
  }, []);

  // Dual-Layer Persistence (LocalStorage + SessionStorage for immediate atomic writes)
  const commitTransaction = (newState: UserStats, newAdminState: AdminData) => {
     setStats(newState);
     setAdminData(newAdminState);
     try {
       localStorage.setItem('equinox_user_stats', JSON.stringify(newState));
       sessionStorage.setItem('equinox_user_stats_backup', JSON.stringify(newState));
       
       localStorage.setItem('equinox_admin_data', JSON.stringify(newAdminState));
       sessionStorage.setItem('equinox_admin_data_backup', JSON.stringify(newAdminState));
     } catch (e) { console.error("Layer B DB Sync Failed", e); }
  };

  const connectWallet = (address: string, sponsorId?: string) => {
    setIsConnected(true);
    const isAdmin = address === '0x71C...97d1'; // Mock Root Admin ID
    const generatedUsername = 'user_' + address.slice(2, 8).toLowerCase();

    // Setup sponsor tracking & record (case-insensitive)
    const rawSponsor = sponsorId || 'admin_root';
    const sponsorObj = adminData.usersList.find(u => u.username.toLowerCase() === rawSponsor.toLowerCase());
    
    // Automatically inject missing sponsors (simulate cross-device consistency)
    let nextAdminData = { ...adminData };
    const finalSponsor = sponsorObj ? sponsorObj.username : rawSponsor; 

    if (!sponsorObj && finalSponsor !== 'admin_root') {
        const dummySponsorId = Math.random().toString(36).substr(2, 9);
        const dummySponsor = {
            id: dummySponsorId,
            username: finalSponsor,
            wallet: '0x' + Math.random().toString(16).substr(2, 40),
            sponsorId: 'admin_root',
            directsCount: 0,
            highestSlot: 1,
            status: 'active' as const,
            joinedAt: new Date().toISOString(),
            balance: 0,
            transactions: [],
            downline: []
        };
        // Update admin_root leads, count, and downline array
        nextAdminData.usersList = nextAdminData.usersList.map(u => 
           (u.username.toLowerCase() === 'admin_root')
              ? { 
                  ...u, 
                  directsCount: u.directsCount + 1,
                  downline: [...(u.downline || []), dummySponsorId]
                }
              : u
        );
        nextAdminData.usersList = [...nextAdminData.usersList, dummySponsor];
        nextAdminData.totalUsers += 1;
    }
    
    // Check if new user, add to directory
    const existing = nextAdminData.usersList.find(u => u.wallet.toLowerCase() === address.toLowerCase());
    
    if (!existing) {
       const newUserId = Math.random().toString(36).substr(2, 9);
       // Append new user to list, increment sponsor's directs, and append to sponsor's downline
       nextAdminData = {
          ...nextAdminData,
          totalUsers: nextAdminData.totalUsers + 1,
          usersList: [
             ...nextAdminData.usersList.map(u => 
                (u.username.toLowerCase() === finalSponsor.toLowerCase()) 
                   ? { 
                       ...u, 
                       directsCount: u.directsCount + 1,
                       downline: [...(u.downline || []), newUserId]
                     } 
                   : {
                       ...u,
                       downline: u.downline || []
                     }
             ),
             {
                id: newUserId,
                username: generatedUsername,
                wallet: address,
                sponsorId: finalSponsor,
                directsCount: 0,
                highestSlot: 1,
                status: 'active',
                joinedAt: new Date().toISOString(),
                balance: 0,
                transactions: [],
                downline: []
             }
          ]
       };
    }
    
    const nextStats = { 
       ...stats, 
       walletAddress: address, 
       isAdmin,
       username: existing ? existing.username : generatedUsername,
       sponsorId: existing ? existing.sponsorId : finalSponsor,
       directTeam: existing ? existing.directsCount : 0,
       availableBalance: existing ? (existing.balance || 0) : 0,
       transactions: existing ? (existing.transactions || []) : []
    };
    
    commitTransaction(nextStats, nextAdminData);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setStats(prev => ({ ...prev, walletAddress: '', isAdmin: false }));
  };

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    recycled: true,
    spillover: true,
    teamJoin: false,
    newCourse: true
  });

  const depositFunds = (amount: number) => {
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'deposit',
      amount,
      status: 'completed',
      date: new Date().toISOString(),
      hash: '0x' + Math.random().toString(16).substr(2, 40)
    };
    setStats(prev => ({
      ...prev,
      availableBalance: prev.availableBalance + amount,
      totalDeposits: prev.totalDeposits + amount,
      transactions: [tx, ...prev.transactions]
    }));
    
    setAdminData(prev => ({
       ...prev,
       usersList: prev.usersList.map(u => 
          u.username.toLowerCase() === stats.username.toLowerCase()
             ? { ...u, balance: u.balance + amount, transactions: [tx, ...u.transactions] }
             : u
       )
    }));
  };

  const withdrawFunds = (amount: number) => {
    if (amount > stats.availableBalance) return;
    const txId = Math.random().toString(36).substr(2, 9);
    const tx: Transaction = {
      id: txId,
      type: 'withdraw',
      amount,
      status: 'pending',
      date: new Date().toISOString(),
      hash: 'PENDING_APPROVAL'
    };
    setStats(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      pendingWithdrawals: prev.pendingWithdrawals + amount,
      transactions: [tx, ...prev.transactions]
    }));

    setAdminData(prev => ({
      ...prev,
      pendingWithdrawals: [{
        id: txId,
        userId: stats.walletAddress, // Using wallet as ID for simplicity
        username: stats.username,
        walletAddress: stats.walletAddress,
        amount,
        status: 'pending',
        date: new Date().toISOString()
      }, ...prev.pendingWithdrawals],
      usersList: prev.usersList.map(u => 
          u.username.toLowerCase() === stats.username.toLowerCase()
             ? { ...u, balance: u.balance - amount, transactions: [tx, ...u.transactions] }
             : u
       )
    }));
  };

  const publishAnnouncement = (msg: string) => {
    setAdminData(prev => ({ ...prev, announcement: msg }));
  };

  const generateVirtualFunds = (amount: number, pin: string) => {
    if (pin !== '123456') return false;
    setAdminData(prev => ({ ...prev, virtualCreditBalance: prev.virtualCreditBalance + amount, totalVolume: prev.totalVolume + amount }));
    return true;
  };

  const transferVirtualFunds = (username: string, amount: number, pin: string) => {
    if (pin !== '123456' || amount > adminData.virtualCreditBalance) return false;
    setAdminData(prev => ({ ...prev, virtualCreditBalance: prev.virtualCreditBalance - amount }));
    
    // Create an internal ledger transaction
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'virtual_credit',
      amount,
      status: 'completed',
      date: new Date().toISOString(),
      hash: 'INTERNAL-VIRTUAL-TRANSFER'
    };
    
    // For demo: if admin sends to themselves, add to their available balance
    if (username === 'admin_root') {
      setStats(prev => ({
        ...prev,
        availableBalance: prev.availableBalance + amount,
        transactions: [tx, ...prev.transactions]
      }));
    }
    return true;
  };

  const updateUserPin = (newPin: string) => {
    setStats(prev => ({ ...prev, pin: newPin }));
  };

  const getUserByUsername = (username: string) => {
    return adminData.usersList.find(u => u.username.toLowerCase() === username.toLowerCase());
  };

  const getUserByWallet = (wallet: string) => {
    return adminData.usersList.find(u => u.wallet.toLowerCase() === wallet.toLowerCase());
  };

  const userTransferVirtualFunds = (username: string, amount: number, pin: string) => {
    if (!stats.pin) return { success: false, message: 'Please set your Security PIN in Settings first' };
    if (stats.pin !== pin) return { success: false, message: 'Invalid PIN' };
    if (amount <= 0 || isNaN(amount)) return { success: false, message: 'Invalid amount' };
    if (amount > stats.availableBalance) return { success: false, message: 'Insufficient balance' };
    
    const cleanUsername = username.replace('@', '').trim();
    if (cleanUsername.toLowerCase() === stats.username.toLowerCase()) {
      return { success: false, message: 'Cannot transfer to yourself' };
    }

    const targetUser = getUserByUsername(cleanUsername);
    if (!targetUser) return { success: false, message: 'Target username not found in directory' };

    const txId = Math.random().toString(36).substr(2, 9);
    const dateStr = new Date().toISOString();

    const senderTx: Transaction = {
      id: txId,
      type: 'withdraw',
      amount,
      status: 'completed',
      date: dateStr,
      hash: `P2P-OUT-TO-${cleanUsername.toUpperCase()}`
    };

    const receiverTx: Transaction = {
      id: txId,
      type: 'deposit',
      amount,
      status: 'completed',
      date: dateStr,
      hash: `P2P-IN-FROM-${stats.username.toUpperCase()}`
    };

    setStats(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      transactions: [senderTx, ...prev.transactions]
    }));

    setAdminData(prev => ({
      ...prev,
      virtualCreditBalance: targetUser.username.toLowerCase() === 'admin_root' 
         ? prev.virtualCreditBalance + amount 
         : prev.virtualCreditBalance,
      usersList: prev.usersList.map(u => {
        if (u.username.toLowerCase() === targetUser.username.toLowerCase()) {
           return { ...u, balance: u.balance + amount, transactions: [receiverTx, ...u.transactions] };
        }
        if (u.username.toLowerCase() === stats.username.toLowerCase()) {
           return { ...u, balance: u.balance - amount, transactions: [senderTx, ...u.transactions] };
        }
        return u;
      })
    }));

    return { success: true, message: `Successfully transferred $${amount} to @${cleanUsername}`, targetWallet: targetUser.wallet };
  };

  const adminActivateSlot = (userId: string, slotId: number) => {
    const slotCost = COSTS[slotId - 1];
    if (!slotCost) return { success: false, message: 'Invalid slot' };
    if (adminData.virtualCreditBalance < slotCost) return { success: false, message: 'Insufficient Admin Virtual Balance' };

    const targetUser = adminData.usersList.find(u => u.id === userId || u.username === userId);
    if (!targetUser) return { success: false, message: 'User not found' };

    if (targetUser.highestSlot >= slotId) return { success: false, message: 'User already has this slot active' };

    // Deduct cost and update user
    setAdminData(prev => ({
      ...prev,
      virtualCreditBalance: prev.virtualCreditBalance - slotCost,
      usersList: prev.usersList.map(u => 
        (u.id === userId || u.username === userId) ? { ...u, highestSlot: Math.max(u.highestSlot, slotId) } : u
      )
    }));

    return { success: true, message: `Successfully activated Slot ${slotId} for @${targetUser.username}` };
  };

  const handleWithdrawalAction = (reqId: string, action: 'approve' | 'reject') => {
    const req = adminData.pendingWithdrawals.find(r => r.id === reqId);
    if (!req) return { success: false, message: 'Request not found' };
    if (req.status !== 'pending') return { success: false, message: 'Already processed' };

    setAdminData(prev => ({
      ...prev,
      pendingWithdrawals: prev.pendingWithdrawals.map(r => 
        r.id === reqId ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r
      )
    }));

    if (action === 'approve') {
      const fee = req.amount * 0.20;
      setAdminData(prev => ({ ...prev, id1Revenue: prev.id1Revenue + fee })); // Add fee to admin
    }

    // Update user stats if the current user is the one who made the request
    if (req.username === stats.username) {
      if (action === 'reject') {
        // Refund back to available balance
        setStats(prev => ({
          ...prev,
          availableBalance: prev.availableBalance + req.amount,
          pendingWithdrawals: prev.pendingWithdrawals - req.amount,
          transactions: prev.transactions.map(t => 
            t.id === reqId ? { ...t, status: 'failed', hash: 'REJECTED - USE P2P' } : t
          )
        }));
      } else if (action === 'approve') {
        // Just clear from pending, it's successful
        const fee = req.amount * 0.20;
        const netAmount = req.amount - fee;
        setStats(prev => ({
          ...prev,
          pendingWithdrawals: prev.pendingWithdrawals - req.amount,
          transactions: prev.transactions.map(t => 
            t.id === reqId ? { ...t, status: 'completed', amount: netAmount, hash: '0x' + Math.random().toString(16).substr(2, 40) } : t
          )
        }));
      }
    }

    if (action === 'approve') {
      return { success: true, message: `Approved withdrawal of $${req.amount} for @${req.username} (20% fee applied).` };
    } else {
      return { success: true, message: `Rejected withdrawal for @${req.username}. User must use P2P Internal Transfer.` };
    }
  };

  const adjustNFTFloor = (newPrice: number) => {
    setStats(prev => ({ ...prev, nftMarketValue: newPrice }));
  };

  const collectAdminFees = () => {
    const feeAmount = stats.royalPool * 0.15; // 15% Platform Maintenance Fee
    if (feeAmount <= 0) return;
    
    setStats(prev => ({
      ...prev,
      royalPool: prev.royalPool - feeAmount,
      availableBalance: prev.availableBalance + feeAmount,
      totalEarnings: prev.totalEarnings + feeAmount
    }));
    setAdminData(prev => ({ ...prev, id1Revenue: prev.id1Revenue + feeAmount }));
  };

  const toggleUserStatus = (userId: string) => {
    setAdminData(prev => ({
      ...prev,
      usersList: prev.usersList.map(u => 
        u.id === userId ? { ...u, status: u.status === 'active' ? 'frozen' : 'active' } : u
      )
    }));
  };

  const determineRank = (highestUnlockedSlot: number): 'Starter' | 'Rising' | 'Prime' | 'Royal' | 'Legendary' => {
    if (highestUnlockedSlot >= 12) return 'Legendary';
    if (highestUnlockedSlot >= 9) return 'Royal';
    if (highestUnlockedSlot >= 6) return 'Prime';
    if (highestUnlockedSlot >= 3) return 'Rising';
    return 'Starter';
  };

  const simulateFill = () => {
    setSlots(prevSlots => {
      const newSlots = [...prevSlots];
      const slotIndex = activeSlotId - 1;
      const slot = { ...newSlots[slotIndex] };

      if (slot.locked) return prevSlots;

      const pos = slot.filledPositions + 1; 
      if (pos > 14) return prevSlots; 

      let earnedForUser = 0;
      let earnedForPool = 0;
      let newTxType: Transaction['type'] = 'matrix_income';
      let txAmount = 0;

      // MATRIX LOGIC EVALUATION
      if (pos === 1 || pos === 2) {
        newTxType = 'upline_loss';
        txAmount = slot.cost;
      } else if ([3, 5, 6, 8, 11, 12].includes(pos)) {
        earnedForUser = slot.cost;
        txAmount = slot.cost;
      } else if (pos === 4 || pos === 9) {
        if (slot.cycle === 1) {
          // Held for next slot
          newTxType = 'spillover_loss';
        } else {
          if (pos === 4) {
            earnedForUser = slot.cost;
            txAmount = slot.cost;
          } else if (pos === 9) {
            earnedForPool = slot.cost;
            newTxType = 'spillover_loss';
          }
        }
      } else if ([7, 10, 13].includes(pos)) {
        newTxType = 'spillover_loss';
        txAmount = slot.cost;
      } else if (pos === 14) {
        newTxType = 'recycle';
        txAmount = slot.cost;
      }

      slot.filledPositions = pos;
      let rankChanged = false;
      let highestSlot = [...newSlots].reverse().find(s => !s.locked)?.id || 1;

      // Handle recycle and upgrages
      if (pos === 14) {
        if (slot.cycle === 1 && activeSlotId < 12) {
          newSlots[slotIndex + 1] = {
            ...newSlots[slotIndex + 1],
            locked: false
          };
          rankChanged = true;
          highestSlot = activeSlotId + 1;
        }
        slot.cycle += 1;
        slot.filledPositions = 0; 
      }

      newSlots[slotIndex] = slot;

      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: newTxType,
        amount: txAmount || slot.cost,
        status: 'completed',
        date: new Date().toISOString(),
        hash: '0x' + Math.random().toString(16).substr(2, 40),
        slotId: slot.id
      };

      setStats(prev => ({
        ...prev,
        availableBalance: prev.availableBalance + earnedForUser,
        totalEarnings: prev.totalEarnings + earnedForUser,
        royalPool: prev.royalPool + earnedForPool,
        rank: determineRank(highestSlot),
        transactions: [newTx, ...prev.transactions]
      }));
      
      // Update Admin Stats automatically
      setAdminData(prev => ({
         ...prev,
         totalVolume: prev.totalVolume + slot.cost,
         id1Revenue: prev.id1Revenue + (newTxType === 'upline_loss' ? slot.cost : 0) // Track passups to ID 1 directly
      }));

      return newSlots;
    });
  };

  const updateUserProfile = (name: string, username: string, email: string) => {
    setStats(prev => ({ ...prev, name, username, email }));
  };

  const updateTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppContext.Provider
      value={{
        isConnected,
        connectWallet,
        disconnectWallet,
        stats,
        slots,
        theme,
        notifications,
        activeSlotId,
        setActiveSlotId,
        simulateFill,
        depositFunds,
        withdrawFunds,
        adminData,
        publishAnnouncement,
        generateVirtualFunds,
        transferVirtualFunds,
        updateUserPin,
        userTransferVirtualFunds,
        getUserByUsername,
        getUserByWallet,
        adminActivateSlot,
        handleWithdrawalAction,
        adjustNFTFloor,
        collectAdminFees,
        toggleUserStatus,
        updateUserProfile,
        updateTheme,
        toggleNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
