import { TrendingUp } from "lucide-react"

const products = [
  {
    id: "PRD001",
    name: "Pollo a la Parrilla",
    category: "Plato Principal",
    quantity: 145,
    value: "$2,610",
  },
  {
    id: "PRD002",
    name: "Pizza Margarita",
    category: "Pizza",
    quantity: 98,
    value: "$1,470",
  },
  {
    id: "PRD003",
    name: "Hamburguesa Clásica",
    category: "Comida Rápida",
    quantity: 87,
    value: "$1,305",
  },
  {
    id: "PRD004",
    name: "Ensalada César",
    category: "Ensaladas",
    quantity: 76,
    value: "$912",
  },
  {
    id: "PRD005",
    name: "Pasta Carbonara",
    category: "Pastas",
    quantity: 64,
    value: "$1,152",
  },
]

export function BestSellingProducts() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Productos Más Vendidos</h3>
          <p className="text-sm text-muted-foreground">Top 5 del período</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                ID
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Producto
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Categoría
              </th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Cantidad
              </th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
              >
                <td className="py-4 px-2 text-sm text-muted-foreground font-medium">{product.id}</td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm font-semibold text-card-foreground">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {product.category}
                  </span>
                </td>
                <td className="py-4 px-2 text-sm text-right font-semibold text-card-foreground">{product.quantity}</td>
                <td className="py-4 px-2 text-sm text-right font-bold text-primary">{product.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
