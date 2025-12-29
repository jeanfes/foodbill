import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, LayoutPanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import LogoTransparent from "../../../../assets/images/logoTransparent.png"
import { usePermissions } from "@/hooks/usePermissions"
import navigationItems from "./navigation"
import type { NavigationItem } from "./navigation"

// Navegación centralizada

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
    const location = useLocation()
    const pathname = location.pathname
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const { hasPermission } = usePermissions()

    const filteredNavigationItems = useMemo<NavigationItem[]>(() => {
        return navigationItems
            .map((item) => {
                // Si el item tiene hijos, se muestra si existe al menos un hijo visible.
                if (item.children && item.children.length > 0) {
                    const filteredChildren = item.children.filter((child) => {
                        if (!child.requiredPermission) return true
                        return hasPermission(child.requiredPermission)
                    })

                    if (filteredChildren.length === 0) {
                        // No hay hijos visibles; solo mostrar el padre si tiene permiso explícito.
                        if (item.requiredPermission) {
                            return hasPermission(item.requiredPermission) ? { ...item, children: [] } : null
                        }
                        return null
                    }
                    return { ...item, children: filteredChildren }
                }

                // Sin hijos: mostrar si no requiere permiso o si lo tiene.
                if (!item.requiredPermission) return item
                return hasPermission(item.requiredPermission) ? item : null
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
                "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 ease-out will-change-[width,transform] z-40 overflow-hidden flex flex-col origin-left transform-gpu",
                isOpen ? "w-64 sidebar-open-animate" : "w-[90px] sidebar-close-animate",
            )}
        >
            <div className={cn("h-20 flex items-center justify-between px-3 transition-all duration-300 sticky top-0 bg-card z-10 border-b border-border/50", isOpen ? "justify-between" : "justify-center")}>
                <Link to="/home" className="flex items-center justify-center shrink-0">
                    <img src={LogoTransparent} alt="logo" className="w-8 h-8 object-contain" />
                </Link>

                <div className={cn(
                    "transition-all duration-300 overflow-hidden",
                    isOpen ? "opacity-100 w-10" : "opacity-0 w-0"
                )}>
                    <Button variant="ghost" size="icon" onClick={onToggle} className="h-10 w-10 flex items-center justify-center">
                        <LayoutPanelLeft className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <nav className={cn(
                "flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll",
                isOpen ? "px-3 py-4 space-y-2" : "px-2 py-3 space-y-2",
                "transition-all duration-300"
            )}>
                {filteredNavigationItems.map((item) => {
                    const Icon = item.icon
                    const hasChildren = !!item.children && item.children.length > 0
                    const isSectionActive = hasChildren
                        ? item.children!.some((c) => pathname.startsWith(c.href))
                        : pathname === item.href
                    const isExpanded = expandedItems.includes(item.name)

                    return (
                        <div key={item.name} className={cn("relative", !isOpen && "flex justify-center")}>
                            <div
                                className={cn(
                                    "absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full transition-opacity duration-150",
                                    isSectionActive && isOpen && !hasChildren ? "opacity-100" : "opacity-0",
                                )}
                            />

                            <Link
                                to={item.href}
                                className={cn(
                                    "flex items-center rounded-2xl transition-all duration-300 ease-out relative group",
                                    isOpen ? "gap-3 p-3.5" : "justify-center items-center p-3.5",
                                    isSectionActive
                                        ? isOpen
                                            ? "bg-primary/10 text-primary shadow-sm"
                                            : "bg-primary text-white shadow-md"
                                        : "text-muted-foreground hover:bg-accent hover:text-white",
                                    isOpen && "sidebar-item-animate",
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
                                        "w-5 h-5 shrink-0 transition-all duration-300",
                                        !isSectionActive && "group-hover:text-white",
                                        isSectionActive ? (isOpen ? "text-primary" : "text-white") : undefined,
                                    )}
                                />
                                {isOpen && (
                                    <>
                                        <span className={cn(
                                            "flex-1 text-sm font-bold transition-all duration-300",
                                            !isSectionActive && "group-hover:text-white"
                                        )}>{item.name}</span>
                                        {item.badge && (
                                            <span className={cn(
                                                "bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300",
                                                !isSectionActive && "group-hover:text-white"
                                            )}>{item.badge}</span>
                                        )}
                                        {item.hasDropdown && (
                                            <ChevronDown
                                                className={cn(
                                                    "w-4 h-4 transition-transform duration-300 ease-out",
                                                    !isSectionActive && "group-hover:text-white",
                                                    isExpanded && "rotate-180",
                                                )}
                                            />
                                        )}
                                    </>
                                )}
                                {!isOpen && item.badge && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>

                            {isOpen && hasChildren && (
                                <div
                                    className={cn(
                                        "pl-9 pr-2 grid transition-all duration-300 ease-out origin-left transform-gpu",
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
                                                            "flex items-center justify-between gap-2 px-2 py-2 rounded-xl text-sm transition-all duration-300 ease-out group",
                                                            childActive
                                                                ? "bg-primary/10 text-primary shadow-sm"
                                                                : "text-muted-foreground hover:bg-accent hover:text-white",
                                                            "sidebar-children-animate",
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
                <div className="mt-auto px-3 py-4 bg-gradient-to-t from-card via-card to-transparent border-t border-border/30 flex justify-center">
                    <Button variant="default" size="icon" onClick={onToggle} className="h-14 w-14 bg-primary text-white rounded-2xl hover:bg-primary/90 shadow-lg transition-all duration-300 flex items-center justify-center">
                        <LayoutPanelLeft className="h-5 w-5" />
                    </Button>
                </div>
            )
            }
        </aside >
    )
}
