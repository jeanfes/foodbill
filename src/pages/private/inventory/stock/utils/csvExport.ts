import type { InventoryItem, InventoryMovement } from '@/interfaces/inventory';

export function exportInventoryToCSV(items: InventoryItem[]) {
  const headers = ['productId', 'sku', 'name', 'unit', 'totalQuantity', 'minQuantity', 'isTrackable', 'categoryName'];
  const rows = items.map(item => [
    item.productId,
    item.sku || '',
    item.name,
    item.unit,
    item.totalQuantity,
    item.minQuantity || '',
    item.isTrackable,
    item.categoryName || ''
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadCSV(csv, `inventario_${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportMovementsToCSV(movements: InventoryMovement[]) {
  const headers = [
    'id',
    'type',
    'productId',
    'productName',
    'fromWarehouseId',
    'fromWarehouseName',
    'toWarehouseId',
    'toWarehouseName',
    'qty',
    'unit',
    'reason',
    'userId',
    'userName',
    'createdAt'
  ];

  const rows = movements.map(m => [
    m.id,
    m.type,
    m.productId,
    m.productName || '',
    m.fromWarehouseId || '',
    m.fromWarehouseName || '',
    m.toWarehouseId || '',
    m.toWarehouseName || '',
    m.qty,
    m.unit || '',
    m.reason || '',
    m.userId || '',
    m.userName || '',
    m.createdAt
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadCSV(csv, `movimientos_inventario_${new Date().toISOString().split('T')[0]}.csv`);
}

function downloadCSV(csvContent: string, filename: string) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
