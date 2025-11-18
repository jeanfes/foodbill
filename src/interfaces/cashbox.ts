export type CashBoxStatus = 'OPEN' | 'CLOSED';

export type MovementType = 'SALE' | 'INCOME' | 'EXPENSE' | 'WITHDRAWAL' | 'ADJUSTMENT' | 'OPENING' | 'CLOSING';

export interface CashBoxMovement {
  id: string;
  type: MovementType;
  amount: number;
  reference?: string;
  note?: string;
  userId: string;
  userName?: string;
  createdAt: string;
}

export interface CashBoxSession {
  id: string;
  cashBoxId: string;
  openedAt: string;
  closedAt?: string;
  openedByUserId: string;
  closedByUserId?: string;
  initialAmount: number;
  expectedAmount: number;
  countedAmount?: number;
  difference?: number;
  openingNote?: string;
  closingNote?: string;
  movements: CashBoxMovement[];
}

export interface CashBox {
  id: string;
  name: string;
  code: string;
  description?: string;
  location?: string;
  active: boolean;
  status: CashBoxStatus;
  assignedUserId?: string;
  assignedUserName?: string;
  requiresOpeningClosing: boolean;
  currentAmount: number;
  currentSession?: CashBoxSession;
  sessions: CashBoxSession[];
  createdAt: string;
  updatedAt?: string;
}

export interface CashBoxFormData {
  name: string;
  code: string;
  description?: string;
  location?: string;
  active: boolean;
  assignedUserId?: string;
  requiresOpeningClosing: boolean;
}

export interface OpenCashBoxData {
  initialAmount: number;
  userId?: string;
  note?: string;
}

export interface CloseCashBoxData {
  countedAmount: number;
  note?: string;
  breakdown?: {
    bills?: Record<string, number>;
    coins?: Record<string, number>;
  };
}

export interface AddMovementData {
  type: MovementType;
  amount: number;
  reference?: string;
  note?: string;
  userId: string;
}
