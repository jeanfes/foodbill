import { Sidebar } from "./components/sidebar/Sidebar"
import { Header } from "./components/header/Header"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Outlet } from "react-router-dom"

interface DashboardLayoutProps {
  children?: React.ReactNode
  title?: string
  subtitle?: string
}

const FullLayout = ({ title, subtitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={cn("transition-[margin-left] duration-200 ease-in-out will-change-[margin-left]", sidebarOpen ? "ml-64" : "ml-20")}>
        <Header title={title ?? ""} subtitle={subtitle} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default FullLayout
