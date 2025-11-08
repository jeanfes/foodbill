import { BestSellingProducts } from "./components/best-selling-products"
import { CashRegisterTable } from "./components/cash-register-table"
import { DateFilter } from "./components/date-filter"
import { KpiCards } from "./components/kpi-cards"
import { RecentActivity } from "./components/recent-activity"
import { RevenueExpenseChart } from "./components/revenue-expense-chart"
import { SalesByDayChart } from "./components/sales-by-day-chart"
import { TopProductsChart } from "./components/top-products-chart"

const Home = () => {
    return (
        <div className="space-y-6">
            <DateFilter />
            <KpiCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueExpenseChart />
                <SalesByDayChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopProductsChart />
                <CashRegisterTable />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BestSellingProducts />
                </div>
                <RecentActivity />
            </div>
        </div>
    )
}

export default Home
