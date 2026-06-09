export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'matrix_income' | 'recycle' | 'spillover_loss' | 'upline_loss' | 'virtual_credit' | 'admin_withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  hash: string;
  slotId?: number;
}

export interface Slot {
  id: number;
  cost: number;
  locked: boolean;
  cycle: number;
  filledPositions: number; // 0 to 14
}

export interface UserStats {
  availableBalance: number;
  totalEarnings: number;
  totalDeposits: number;
  pendingWithdrawals: number;
  virtualBalance: number;
  royalPool: number;
  nftMarketValue: number;
  walletAddress: string;
  name: string;
  username: string;
  email: string;
  pin: string;
  referralCode: string;
  sponsorId: string; // NEW
  directTeam: number; // NEW
  transactions: Transaction[];
  rank: 'Starter' | 'Rising' | 'Prime' | 'Royal' | 'Legendary';
  isAdmin?: boolean;
}

export interface UserRecord {
  id: string;
  username: string;
  wallet: string;
  sponsorId: string;
  directsCount: number;
  highestSlot: number;
  status: 'active' | 'frozen';
  joinedAt: string;
  balance: number;
  transactions: Transaction[];
  downline?: string[];
}

export interface MatrixNodePlacement {
  position: number; // 1 to 14
  userId: string;
}

export interface MatrixRecord {
  id: string;
  slotId: number;
  ownerId: string;
  cycle: number;
  placements: MatrixNodePlacement[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  walletAddress: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface AdminData {
  totalUsers: number;
  dailyGrowth: number;
  totalVolume: number;
  id1Revenue: number;
  virtualCreditBalance: number;
  announcement: string | null;
  usersList: UserRecord[]; // Updated to use UserRecord
  pendingWithdrawals: WithdrawalRequest[];
}
