import { useEffect, useState } from 'react';
import type { Table, TableFormData, TableStatus } from '@/interfaces/table';
import { loadTables, saveTables } from '@/lib/mockData/tables';

export interface TablesFilters {
  search?: string;
  status?: TableStatus | 'todas';
}

export function useTablesMock() {
  const [tables, setTables] = useState<Table[]>(() => loadTables());

  useEffect(() => {
    saveTables(tables);
  }, [tables]);

  const filtered = (filters?: TablesFilters) => {
    if (!filters) return tables;
    const q = (filters.search || '').toLowerCase();
    const status = filters.status && filters.status !== 'todas' ? filters.status : undefined;
    return tables.filter(t => {
      if (q) {
        const matches = t.nombre.toLowerCase().includes(q) || (t.ubicacion || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (status && t.estado !== status) return false;
      return true;
    });
  };

  const findById = (id: string) => tables.find(t => t.id === id) || null;

  const create = (data: TableFormData) => {
    const t: Table = {
      id: crypto.randomUUID(),
      nombre: data.nombre.trim(),
      capacidad: Number(data.capacidad) || 0,
      estado: data.estado,
      ubicacion: data.ubicacion?.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTables(prev => [t, ...prev]);
    return t;
  };

  const update = (id: string, data: TableFormData) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t,
      nombre: data.nombre.trim(),
      capacidad: Number(data.capacidad) || 0,
      estado: data.estado,
      ubicacion: data.ubicacion?.trim() || undefined,
      updatedAt: new Date().toISOString(),
    } : t));
  };

  const remove = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  };

  const setStatus = (id: string, estado: TableStatus) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, estado, updatedAt: new Date().toISOString() } : t));
  };

  return { tables, filtered, findById, create, update, remove, setStatus };
}
