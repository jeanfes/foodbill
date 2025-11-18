import type { Table, TableStatus } from '@/interfaces/table';

const STORAGE_KEY = 'fb_tables_mock_v1';

const initial: Table[] = [
  { id: 't-1', nombre: 'Mesa 1', capacidad: 2, estado: 'disponible', createdAt: new Date().toISOString(), ubicacion: 'Sala' },
  { id: 't-2', nombre: 'Mesa 2', capacidad: 4, estado: 'ocupada', createdAt: new Date().toISOString(), ubicacion: 'Terraza' },
  { id: 't-3', nombre: 'Mesa 3', capacidad: 4, estado: 'reservada', createdAt: new Date().toISOString(), ubicacion: 'Sala' },
  { id: 't-4', nombre: 'Mesa 4', capacidad: 6, estado: 'disponible', createdAt: new Date().toISOString(), ubicacion: 'VIP' },
  { id: 't-5', nombre: 'Mesa 5', capacidad: 2, estado: 'inactiva', createdAt: new Date().toISOString(), ubicacion: 'Barra' },
  { id: 't-6', nombre: 'Mesa 6', capacidad: 8, estado: 'disponible', createdAt: new Date().toISOString(), ubicacion: 'Terraza' },
];

export function loadTables(): Table[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Table[];
    return parsed.length ? parsed : initial;
  } catch {
    return initial;
  }
}

export function saveTables(data: Table[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function statusBadgeVariant(status: TableStatus): { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string; label: string } {
  switch (status) {
    case 'disponible':
      return { variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-600 text-white', label: 'Disponible' };
    case 'ocupada':
      return { variant: 'secondary', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400', label: 'Ocupada' };
    case 'reservada':
      return { variant: 'outline', className: 'border-blue-500/40 text-blue-600 dark:text-blue-400', label: 'Reservada' };
    case 'inactiva':
    default:
      return { variant: 'destructive', label: 'Inactiva' };
  }
}
