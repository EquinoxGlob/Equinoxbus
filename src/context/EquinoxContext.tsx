import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Slot, UserStats } from '../types';

interface EquinoxContextType {
  isConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  stats: UserStats;
  slots: Slot[];
  activeSlotId: number;
  setActiveSlotId: (id: number) => void;
  simulateFill: () => void;
  sellNFT: () => void;
}

export const EquinoxContext = createContext<EquinoxContextType | undefined>(undefined);

const INITIAL_SLOTS: Slot[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  cost: 50 * Math.pow(2, i), // 50, 100, 200, 400...
  locked: i > 0, // Only slot 1 is unlocked initially
  cycle: 1,
  filledPositions: 0,
}));

export function EquinoxProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalEarnings: 0,
    royalPool: 0,
    nftMinted: false,
    nftMarketValue: 150.0, // Baseline value
  });
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [activeSlotId, setActiveSlotId] = useState<number>(1);

  const connectWallet = () => {
    setIsConnected(true);
    if (!stats.nftMinted) {
      setStats(prev => ({ ...prev, nftMinted: true }));
      // In a real app, logic to mint NFT natively would occur here
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  const sellNFT = () => {
    setStats(prev => ({
      ...prev,
      totalEarnings: prev.totalEarnings + prev.nftMarketValue,
      nftMinted: false,
      nftMarketValue: 0
    }));
  };

  const simulateFill = () => {
    setSlots(prevSlots => {
      const newSlots = [...prevSlots];
      const slotIndex = activeSlotId - 1;
      const slot = { ...newSlots[slotIndex] };

      if (slot.locked) return prevSlots;

      const pos = slot.filledPositions + 1; // 1-indexed (1 to 14)
      if (pos > 14) return prevSlots; // Should not happen

      let earnedForUser = 0;
      let earnedForPool = 0;

      // MATRIX LOGIC EVALUATION
      if (pos === 1 || pos === 2) {
        // Uplines -> no user earnings
      } else if ([3, 5, 6, 8, 11, 12].includes(pos)) {
        // Direct to user
        earnedForUser = slot.cost;
      } else if (pos === 4 || pos === 9) {
        if (slot.cycle === 1) {
          // Retained for next slot upgrade
          // Doesn't reflect in liquid earnings
        } else {
          if (pos === 4) {
            earnedForUser = slot.cost;
          } else if (pos === 9) {
            earnedForPool = slot.cost;
          }
        }
      } else if ([7, 10, 13].includes(pos)) {
        // Downline spillover -> no user earnings
      } else if (pos === 14) {
        // Recycle
      }

      slot.filledPositions = pos;

      // Handle recycle and upgrages
      if (pos === 14) {
        if (slot.cycle === 1 && activeSlotId < 12) {
          // Unlock next slot
          newSlots[slotIndex + 1] = {
            ...newSlots[slotIndex + 1],
            locked: false
          };
        }
        slot.cycle += 1;
        slot.filledPositions = 0; // Clear UI for next cycle visually
      }

      newSlots[slotIndex] = slot;

      // Update global stats
      if (earnedForUser > 0 || earnedForPool > 0) {
        setStats(prev => ({
          ...prev,
          totalEarnings: prev.totalEarnings + earnedForUser,
          royalPool: prev.royalPool + earnedForPool,
          nftMarketValue: prev.nftMarketValue + (earnedForPool * 0.5) // 50% injected to NFT
        }));
      }

      return newSlots;
    });
  };

  return (
    <EquinoxContext.Provider
      value={{
        isConnected,
        connectWallet,
        disconnectWallet,
        stats,
        slots,
        activeSlotId,
        setActiveSlotId,
        simulateFill,
        sellNFT
      }}
    >
      {children}
    </EquinoxContext.Provider>
  );
}

export const useEquinox = () => {
  const context = useContext(EquinoxContext);
  if (context === undefined) {
    throw new Error('useEquinox must be used within an EquinoxProvider');
  }
  return context;
};
