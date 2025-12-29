import type { 
  CashBox, 
  CashBoxFormData, 
  OpenCashBoxData, 
  CloseCashBoxData, 
  AddMovementData,
  CashBoxMovement,
  CashBoxSession
} from '@/interfaces/cashbox';
import { useEffect, useState, useCallback } from 'react';
import { getUserName } from '@/lib/mockData/users';

const STORAGE_KEY = 'cashboxes';

function loadInitial(): CashBox[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const boxes = JSON.parse(raw);
      // Enriquecer con nombres de usuario y asegurar propiedades necesarias
      return boxes.map((box: CashBox) => ({
        ...box,
        sessions: box.sessions || [],
        assignedUserName: box.assignedUserId ? getUserName(box.assignedUserId) : undefined,
      }));
    }
  } catch (_) { }
  const seed: CashBox[] = [
    {
      id: crypto.randomUUID(),
      name: 'Caja Cocina',
      code: 'CX-001',
      description: 'Caja principal del área de cocina',
      location: 'Cocina',
      active: true,
      status: 'CLOSED',
      assignedUserId: undefined,
      assignedUserName: undefined,
      requiresOpeningClosing: true,
      currentAmount: 0,
      sessions: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Caja Barra',
      code: 'CX-002',
      description: 'Caja del área de bar',
      location: 'Barra',
      active: true,
      status: 'CLOSED',
      assignedUserId: undefined,
      assignedUserName: undefined,
      requiresOpeningClosing: true,
      currentAmount: 0,
      sessions: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Caja Móvil',
      code: 'CX-003',
      description: 'Caja portátil para eventos',
      location: 'Móvil',
      active: false,
      status: 'CLOSED',
      assignedUserId: undefined,
      assignedUserName: undefined,
      requiresOpeningClosing: false,
      currentAmount: 0,
      sessions: [],
      createdAt: new Date().toISOString(),
    }
  ];
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch (_) { }
  return seed;
}

export function useCashBoxesMock() {
  const [cashBoxes, setCashBoxes] = useState<CashBox[]>(() => loadInitial());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cashBoxes)); } catch (_) { }
  }, [cashBoxes]);

  const create = useCallback((data: CashBoxFormData) => {
    const newBox: CashBox = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      code: data.code.trim(),
      description: data.description?.trim() || undefined,
      location: data.location?.trim() || undefined,
      active: data.active,
      status: 'CLOSED',
      assignedUserId: data.assignedUserId || undefined,
      assignedUserName: data.assignedUserId ? getUserName(data.assignedUserId) : undefined,
      requiresOpeningClosing: data.requiresOpeningClosing,
      currentAmount: 0,
      sessions: [],
      createdAt: new Date().toISOString(),
    };
    setCashBoxes(prev => [...prev, newBox]);
    return newBox;
  }, []);

  const update = useCallback((id: string, data: CashBoxFormData) => {
    setCashBoxes(prev => prev.map(box => box.id === id ? {
      ...box,
      name: data.name.trim(),
      code: data.code.trim(),
      description: data.description?.trim() || undefined,
      location: data.location?.trim() || undefined,
      active: data.active,
      assignedUserId: data.assignedUserId || undefined,
      assignedUserName: data.assignedUserId ? getUserName(data.assignedUserId) : undefined,
      requiresOpeningClosing: data.requiresOpeningClosing,
      updatedAt: new Date().toISOString(),
    } : box));
  }, []);

  const toggleActive = useCallback((id: string) => {
    setCashBoxes(prev => prev.map(box => box.id === id ? {
      ...box,
      active: !box.active,
      updatedAt: new Date().toISOString(),
    } : box));
  }, []);

  const openCashBox = useCallback((id: string, data: OpenCashBoxData) => {
    setCashBoxes(prev => prev.map(box => {
      if (box.id !== id) return box;
      
      const newSession: CashBoxSession = {
        id: crypto.randomUUID(),
        cashBoxId: id,
        openedAt: new Date().toISOString(),
        openedByUserId: data.userId || 'system',
        initialAmount: data.initialAmount,
        expectedAmount: data.initialAmount,
        openingNote: data.note,
        movements: [{
          id: crypto.randomUUID(),
          type: 'OPENING',
          amount: data.initialAmount,
          userId: data.userId || 'system',
          userName: data.userId ? getUserName(data.userId) : 'Sistema',
          note: data.note,
          createdAt: new Date().toISOString(),
        }],
      };

      return {
        ...box,
        status: 'OPEN',
        currentAmount: data.initialAmount,
        currentSession: newSession,
        sessions: [...(box.sessions || []), newSession],
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const closeCashBox = useCallback((id: string, data: CloseCashBoxData) => {
    setCashBoxes(prev => prev.map(box => {
      if (box.id !== id || !box.currentSession) return box;

      const difference = data.countedAmount - box.currentSession.expectedAmount;
      const closedSession: CashBoxSession = {
        ...box.currentSession,
        closedAt: new Date().toISOString(),
        closedByUserId: 'current-user', // Aquí deberías usar el usuario actual
        countedAmount: data.countedAmount,
        difference,
        closingNote: data.note,
        movements: [
          ...box.currentSession.movements,
          {
            id: crypto.randomUUID(),
            type: 'CLOSING',
            amount: data.countedAmount,
            userId: 'current-user',
            userName: 'Usuario Actual',
            note: data.note,
            createdAt: new Date().toISOString(),
          }
        ],
      };

      // Actualizar la sesión en el array de sesiones
      const updatedSessions = (box.sessions || []).map(s => 
        s.id === box.currentSession?.id ? closedSession : s
      );

      return {
        ...box,
        status: 'CLOSED',
        currentAmount: data.countedAmount,
        currentSession: undefined,
        sessions: updatedSessions,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const addMovement = useCallback((id: string, data: AddMovementData) => {
    setCashBoxes(prev => prev.map(box => {
      if (box.id !== id || !box.currentSession) return box;

      const newMovement: CashBoxMovement = {
        id: crypto.randomUUID(),
        type: data.type,
        amount: data.amount,
        reference: data.reference,
        note: data.note,
        userId: data.userId,
        userName: getUserName(data.userId),
        createdAt: new Date().toISOString(),
      };

      // Calcular el cambio en el saldo (+ para ingresos, - para gastos)
      const isPositive = ['SALE', 'INCOME'].includes(data.type);
      const isNegative = ['EXPENSE', 'WITHDRAWAL'].includes(data.type);
      const amountChange = isPositive ? data.amount : isNegative ? -data.amount : data.amount;

      const updatedSession: CashBoxSession = {
        ...box.currentSession,
        expectedAmount: box.currentSession.expectedAmount + amountChange,
        movements: [newMovement, ...box.currentSession.movements], // Nuevo primero
      };

      return {
        ...box,
        currentAmount: box.currentAmount + amountChange,
        currentSession: updatedSession,
        sessions: box.sessions.map(s => 
          s.id === box.currentSession?.id ? updatedSession : s
        ),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const findById = useCallback((id: string) => cashBoxes.find(b => b.id === id) || null, [cashBoxes]);

  const remove = useCallback((id: string) => {
    setCashBoxes(prev => prev.filter(b => b.id !== id));
  }, []);

  return {
    cashBoxes,
    create,
    update,
    toggleActive,
    openCashBox,
    closeCashBox,
    addMovement,
    findById,
    remove,
  };
}
