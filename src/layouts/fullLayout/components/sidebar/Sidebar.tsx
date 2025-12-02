import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
    ChevronDown,
    Home,
    LayoutPanelLeft,
    BarChart3,
    RefreshCw,
    Shield,
    Package,
    Users,
    Building2,
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
    {
        name: "Inicio",
        href: "/home",
        icon: Home,
        requiredPermission: Permission.VIEW_DASHBOARD
    },
    {
        name: "Maestros",
        href: "/maestros/clientes",
        icon: Users,
        hasDropdown: true,
        requiredPermission: Permission.MAE_CLIENTES_VIEW,
        children: [
            { name: "Cajas", href: "/maestros/cajas", requiredPermission: Permission.MAE_CAJAS_VIEW },
            { name: "Clientes", href: "/maestros/clientes", requiredPermission: Permission.MAE_CLIENTES_VIEW },
            { name: "Terceros", href: "/maestros/terceros", requiredPermission: Permission.MAE_PROVEEDORES_VIEW },
            { name: "Mesas", href: "/maestros/mesas", requiredPermission: Permission.MAE_MESAS_VIEW },
            { name: "Bodegas", href: "/maestros/bodegas", requiredPermission: Permission.MAE_BODEGAS_VIEW },
        ],
    },
    {
        name: "Inventario",
        href: "/inventario/stock",
        icon: Package,
        hasDropdown: true,
        requiredPermission: Permission.INV_VIEW,
        children: [
            { name: "Categorías", href: "/inventario/categorias", requiredPermission: Permission.CAT_CATEGORIAS_VIEW },
            { name: "Movimientos", href: "/inventario/movimientos", requiredPermission: Permission.INV_VIEW_MOVIMIENTOS },
            { name: "Menú", href: "/inventario/menu", requiredPermission: Permission.CAT_MENU_VIEW },
            { name: "Productos", href: "/inventario/productos", requiredPermission: Permission.CAT_PRODUCTOS_VIEW },
            { name: "Stock", href: "/inventario/stock", requiredPermission: Permission.INV_VIEW },
        ],
    },
    {
        name: "Movimientos",
        href: "/movimientos/puntos-de-ventas",
        icon: RefreshCw,
        hasDropdown: true,
        requiredPermission: Permission.VENTA_VIEW,
        children: [
            { name: "Flujo de Ventas", href: "/movimientos/puntos-de-ventas", requiredPermission: Permission.VENTA_FLUJO },
            { name: "Facturas", href: "/movimientos/facturas", requiredPermission: Permission.VENTA_FACTURAR },
            { name: "Cocina", href: "/movimientos/cocina", requiredPermission: Permission.VENTA_VIEW_KITCHEN },
            { name: "Barra", href: "/movimientos/bar", requiredPermission: Permission.VENTA_VIEW_BAR },
            { name: "Gastos", href: "/movimientos/gastos", requiredPermission: Permission.FIN_GASTOS_VIEW },
            { name: "Cuentas por Cobrar", href: "/movimientos/cuentas-por-cobrar", requiredPermission: Permission.FIN_RECEIVABLES_VIEW },
            { name: "Notas de Crédito", href: "/movimientos/notas-credito", requiredPermission: Permission.FIN_CREDIT_NOTES_VIEW },
        ],
    },
    {
        name: "Reportes",
        href: "/reportes/ventas",
        icon: BarChart3,
        hasDropdown: true,
        requiredPermission: Permission.REP_VENTAS,
        children: [
            { name: "Ventas", href: "/reportes/ventas", requiredPermission: Permission.REP_VENTAS },
            { name: "Inventario", href: "/reportes/inventario", requiredPermission: Permission.REP_INVENTARIO },
            { name: "Cuadre de Caja", href: "/reportes/caja", requiredPermission: Permission.REP_CAJA },
            { name: "Gastos", href: "/reportes/gastos", requiredPermission: Permission.REP_GASTOS },
        ],
    },
    {
        name: "Administración",
        href: "/administracion/empresa",
        icon: Building2,
        hasDropdown: true,
        requiredPermission: Permission.ADM_EMPRESA_VIEW,
        children: [
            { name: "Empresa", href: "/administracion/empresa", requiredPermission: Permission.ADM_EMPRESA_VIEW },
            { name: "Locales", href: "/administracion/locales", requiredPermission: Permission.ADM_LOCALES_VIEW },
            { name: "Configuración", href: "/administracion/configuracion", requiredPermission: Permission.ADM_SETTINGS_VIEW },
        ],
    },
    {
        name: "Seguridad",
        href: "/seguridad/usuarios",
        icon: Shield,
        hasDropdown: true,
        requiredPermission: Permission.SEG_USUARIOS_VIEW,
        children: [
            { name: "Usuarios", href: "/seguridad/usuarios", requiredPermission: Permission.SEG_USUARIOS_VIEW },
            { name: "Roles", href: "/seguridad/roles", requiredPermission: Permission.SEG_ROLES_VIEW },
            { name: "Auditoría", href: "/seguridad/auditoria", requiredPermission: Permission.SEG_AUDIT_VIEW },
            { name: "Cambiar Contraseña", href: "/seguridad/cambiar-contrasena", requiredPermission: Permission.SEG_CHANGE_PASSWORD },
        ],
    },


];

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
                "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-150 ease-in-out will-change-[width] z-40 overflow-hidden",
                isOpen ? "w-64" : "w-20",
            )}
        >
            <div className={cn("h-16 flex items-center px-4 transition-all duration-150 sticky top-0 bg-card z-10", isOpen ? "justify-between" : "justify-center")}>
                <Link to="/home" className="flex items-center gap-3">
                    <div>
                        <img src={LogoTransparent} alt="logo" className="authLogoSmall w-8 h-8 object-contain" />
                    </div>
                </Link>

                <div className={cn("transition-all duration-150 overflow-hidden", isOpen ? "opacity-100 w-10" : "opacity-0 w-0")}>
                    <Button variant="ghost" size="icon" onClick={onToggle} className="h-10 w-10">
                        <LayoutPanelLeft className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <nav className={cn(
                "p-4 pb-12 space-y-2 pr-2.5 overflow-y-auto overflow-x-hidden sidebar-scroll",
                "h-[calc(100vh-4rem)]"
            )}>
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
                                    "absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full transition-opacity duration-150",
                                    isSectionActive && isOpen && !hasChildren ? "opacity-100" : "opacity-0",
                                )}
                            />

                            <Link
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-2.5 py-3.5 rounded-2xl transition-all duration-150 relative group",
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
                                        "w-5 h-5 shrink-0 transition-colors duration-150",
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
                                                    "w-4 h-4 transition-transform duration-150",
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
                                        "pl-9 pr-2 grid transition-all duration-150",
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
                                                            "absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full transition-opacity duration-150",
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
                <div className="sticky bottom-4 left-0 right-0 px-4 bg-card" onClick={onToggle}>
                    <Button variant="default" size="icon" onClick={onToggle} className="h-[47px] w-[47px] bg-primary text-white rounded-2xl">
                        <LayoutPanelLeft className="h-4 w-4" />
                    </Button>
                </div>
            )
            }
        </aside >
    )
}
