import { Package, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface InventoryKpisProps {
  totalItems: number;
  stockLowCount: number;
}

export function InventoryKpis({ totalItems, stockLowCount }: InventoryKpisProps) {
  const kpis = [
    {
      label: 'Productos rastreados',
      value: totalItems,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      label: 'Stock bajo',
      value: stockLowCount,
      icon: AlertTriangle,
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
