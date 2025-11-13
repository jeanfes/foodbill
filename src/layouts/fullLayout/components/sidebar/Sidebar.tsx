import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
    ChevronDown,
    Home,
    LayoutPanelLeft,
    Settings,
    BarChart3,
    Boxes,
    Archive,
    Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import LogoTransparent from "../../../../assets/images/logoTransparent.png"
import { usePermissions } from "@/hooks/usePermissions"
import { Permission } from "@/interfaces/role"

interface NavigationItem {
    name: string
    href: string
    icon: any
    hasDropdown?: boolean
    badge?: string | number
    requiredPermission?: Permission
    children?: Array<{
        name: string
        href: string
        badge?: string | number
        requiredPermission?: Permission
    }>
}


const navigationItems: NavigationItem[] = [
    { name: "Home", href: "/home", icon: Home, requiredPermission: Permission.VIEW_DASHBOARD },
    {
        name: "Registros",
        href: "/records/clients",
        icon: Archive,
        hasDropdown: true,
        children: [
            { name: "Clientes", href: "/records/clients" },
            { name: "Productos", href: "/records/products", requiredPermission: Permission.VIEW_PRODUCTS },
            { name: "Categorías", href: "/records/categories", requiredPermission: Permission.VIEW_CATEGORIES },
            { name: "Bodegas", href: "/records/warehouses" },
            { name: "Cajas", href: "/records/registers" },
            { name: "Mesas", href: "/records/tables" },
        ],
    },

    {
        name: "Movimientos",
        href: "/movements/inventory",
        icon: Boxes,
        hasDropdown: true,
        children: [
            { name: "Inventario", href: "/movements/inventory" },
            { name: "Facturación (POS)", href: "/movements/pos" },
            { name: "Gastos", href: "/movements/expenses" },
            { name: "Anulaciones", href: "/movements/voids" },
        ],
    },
    {
        name: "Informes",
        href: "/reports/sales",
        icon: BarChart3,
        hasDropdown: true,
        children: [
            { name: "Ventas", href: "/reports/sales" },
            { name: "Cuadre de caja", href: "/reports/cash-closing" },
            { name: "Gastos", href: "/reports/expenses" },
        ],
    },
    {
        name: "Configuración",
        href: "/settings/tables",
        icon: Settings,
        hasDropdown: true,
        children: [
            { name: "Mesas", href: "/settings/tables" },
            { name: "Caja", href: "/settings/cash-register" },
            { name: "Menú", href: "/settings/menu" },
            { name: "Roles", href: "/settings/roles" },
        ],
    },
    {
        name: "Seguridad",
        href: "/security/users",
        icon: Shield,
        hasDropdown: true,
        children: [
            { name: "Usuarios", href: "/security/users" },
            { name: "Cambiar contraseña", href: "/security/change-password" },
        ],
    },
]

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
    const location = useLocation()
    const pathname = location.pathname
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const { hasPermission } = usePermissions()

    const filteredNavigationItems = useMemo(() => {
        return navigationItems
            .map((item) => {
                if (item.requiredPermission && !hasPermission(item.requiredPermission)) return null

                if (item.children && item.children.length > 0) {
                    const filteredChildren = item.children.filter((child) => {
                        if (!child.requiredPermission) return true
                        return hasPermission(child.requiredPermission)
                    })

                    if (filteredChildren.length === 0) return null
                    return { ...item, children: filteredChildren }
                }

                return item
            })
            .filter(Boolean) as NavigationItem[]
    }, [hasPermission])

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
                {filteredNavigationItems.map((item) => {
                    const Icon = item.icon
                    const hasChildren = !!item.children && item.children.length > 0
                    const isSectionActive = hasChildren
                        ? item.children!.some((c) => pathname.startsWith(c.href))
                        : pathname === item.href
                    const isExpanded = expandedItems.includes(item.name)

                    return (
                        <div key={item.name} className="relative">
                            <div
                                className={cn(
                                    "absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full transition-opacity duration-300",
                                    isSectionActive && isOpen && !hasChildren ? "opacity-100" : "opacity-0",
                                )}
                            />

                            <Link
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-2.5 py-3.5 rounded-2xl transition-all duration-300 relative group",
                                    isSectionActive
                                        ? isOpen
                                            ? "bg-primary/10 text-primary"
                                            : "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-accent hover:text-white",
                                    !isOpen && "justify-center",
                                )}
                                onClick={(e) => {
                                    if (item.hasDropdown && isOpen) {
                                        e.preventDefault()
                                        toggleExpanded(item.name)
                                    }
                                }}
                            >
                                <Icon
                                    className={cn(
                                        "w-5 h-5 shrink-0 transition-colors duration-300",
                                        !isSectionActive && "group-hover:text-white",
                                        isSectionActive ? (isOpen ? "text-primary" : "text-white") : undefined,
                                    )}
                                />
                                {isOpen && (
                                    <>
                                        <span className={cn(
                                            "flex-1 text-sm font-bold transition-colors",
                                            !isSectionActive && "group-hover:text-white"
                                        )}>{item.name}</span>
                                        {item.badge && (
                                            <span className={cn(
                                                "bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full transition-colors",
                                                !isSectionActive && "group-hover:text-white"
                                            )}>{item.badge}</span>
                                        )}
                                        {item.hasDropdown && (
                                            <ChevronDown
                                                className={cn(
                                                    "w-4 h-4 transition-transform duration-300",
                                                    !isSectionActive && "group-hover:text-white",
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

                            {isOpen && hasChildren && (
                                <div
                                    className={cn(
                                        "pl-9 pr-2 grid transition-all duration-300",
                                        isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0",
                                    )}
                                >
                                    <div className="overflow-hidden space-y-1">
                                        {item.children!.map((child) => {
                                            const childActive = pathname.startsWith(child.href)
                                            return (
                                                <div key={child.name} className="relative">
                                                    <div
                                                        className={cn(
                                                            "absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full transition-opacity duration-300",
                                                            childActive ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                    <Link
                                                        to={child.href}
                                                        className={cn(
                                                            "flex items-center justify-between gap-2 px-2 py-2 rounded-xl text-sm transition-colors group",
                                                            childActive
                                                                ? "bg-primary/10 text-primary"
                                                                : "text-muted-foreground hover:bg-accent hover:text-white",
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "truncate transition-colors",
                                                            !childActive && "group-hover:text-white"
                                                        )}>{child.name}</span>
                                                        {child.badge && (
                                                            <span className={cn(
                                                                "bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors",
                                                                !childActive && "group-hover:text-white"
                                                            )}>{child.badge}</span>
                                                        )}
                                                    </Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
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
