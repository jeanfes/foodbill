export interface MockUser {
  id: string;
  name: string;
  role?: string;
}

// Mock consistente para asignación en formularios sin backend aún.
export const usersMock: MockUser[] = [
  { id: 'u1', name: 'Cajero 1', role: 'cashier' },
  { id: 'u2', name: 'Cajero 2', role: 'cashier' },
  { id: 'u3', name: 'Supervisor', role: 'supervisor' },
  { id: 'u4', name: 'Administrador', role: 'admin' },
];

export function getUserName(id?: string) {
  return usersMock.find(u => u.id === id)?.name;
}
