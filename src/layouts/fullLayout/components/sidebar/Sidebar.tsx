import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    ShoppingBag,
    Calendar,
    Package,
    Star,
    ChevronDown,
    Home,
    LayoutPanelLeft,
    Salad,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import LogoTransparent from "../../../../assets/images/logoTransparent.png"

interface NavigationItem {
    name: string
    href: string
    icon: any
    hasDropdown?: boolean
    badge?: string | number
}

const navigationItems: NavigationItem[] = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Menu", href: "/menu", icon: Salad },
    { name: "Inventory", href: "/inventory", icon: Package, hasDropdown: true },
    { name: "Reviews", href: "/reviews", icon: Star },
]

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
    const location = useLocation()
    const pathname = location.pathname
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const toggleExpanded = (name: string) =>
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
        )

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out will-change-[width] z-40",
                isOpen ? "w-64" : "w-20",
            )}
            style={{ overflow: 'hidden' }}
        >
            <div className={cn("h-16 flex items-center px-4 transition-all duration-300", isOpen ? "justify-between" : "justify-center")}>
                <Link to="/home" className="flex items-center gap-3">
                    <div>
                        <img src={LogoTransparent} alt="logo" className="authLogoSmall w-8 h-8 object-contain" />
                    </div>
                </Link>

                <div className={cn("transition-all duration-300 overflow-hidden", isOpen ? "opacity-100 w-10" : "opacity-0 w-0")}>
                    <Button variant="ghost" size="icon" onClick={onToggle} className="h-10 w-10">
                        <LayoutPanelLeft className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <nav className="p-4 space-y-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    const isExpanded = expandedItems.includes(item.name)

                    return (
                        <div key={item.name} className="relative">
                            <div className={cn(
                                "absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full transition-opacity duration-300",
                                isActive && isOpen ? "opacity-100" : "opacity-0"
                            )} />

                            <Link
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-2.5 py-3.5 rounded-2xl transition-all duration-300 relative group",
                                    isActive
                                        ? isOpen
                                            ? "bg-primary/10 text-primary"
                                            : "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                    !isOpen && "justify-center",
                                )}
                                onClick={(e) => {
                                    if (item.hasDropdown && isOpen) {
                                        e.preventDefault()
                                        toggleExpanded(item.name)
                                    }
                                }}
                            >
                                <Icon className={cn("w-5 h-5 shrink-0 transition-colors duration-300", isActive ? (isOpen ? "text-primary" : "text-white") : undefined)} />
                                {isOpen && (
                                    <>
                                        <span className="flex-1 text-sm font-bold">{item.name}</span>
                                        {item.badge && (
                                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                        {item.hasDropdown && (
                                            <ChevronDown
                                                className={cn(
                                                    "w-4 h-4 transition-transform duration-300",
                                                    isExpanded && "rotate-180",
                                                )}
                                            />
                                        )}
                                    </>
                                )}
                                {!isOpen && item.badge && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        </div>
                    )
                })}
            </nav>

            {!isOpen && (
                <div className="absolute bottom-4 left-0 right-0 px-4" onClick={onToggle}>
                    <Button variant="default" size="icon" onClick={onToggle} className="h-[47px] w-[47px] bg-primary text-white rounded-2xl">
                        <LayoutPanelLeft className="h-4 w-4" />
                    </Button>
                </div>
            )
            }
        </aside >
    )
}
