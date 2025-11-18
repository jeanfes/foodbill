export type TableStatus = 'disponible' | 'ocupada' | 'reservada' | 'inactiva';

export interface Table {
  id: string;
  nombre: string;
  capacidad: number;
  estado: TableStatus;
  ubicacion?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TableFormData {
  nombre: string;
  capacidad: number;
  estado: TableStatus;
  ubicacion?: string;
}
