import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { SettingsDialog } from "./Settings"
import { useState } from "react"

interface HeaderProps {
  title: string
  subtitle?: string
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.profile
    ? `${user.profile.name} ${user.profile.last_name}`
    : "Usuario";

  const userRole = user?.profile?.role?.name || "Sin rol";

  const initials = user?.profile
    ? `${user.profile.name.charAt(0)}${user.profile.last_name.charAt(0)}`.toUpperCase()
    : "U";

  return (
    <header className="h-16 bg-transparent flex items-center justify-between px-6">
      <div className="flex items-center h-10">
        <div>
          <h1 className="text-lg font-semibold text-foreground leading-none">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground leading-none">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center bg-card rounded-md overflow-hidden h-10 border">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-9 h-10 w-64 bg-card border-0 focus:ring-0 focus:border-0 rounded-md"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 p-0 bg-card border relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Nuevo pedido recibido</p>
                <p className="text-xs text-muted-foreground">Pedido #ORD1028 - hace 2 minutos</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Inventario bajo</p>
                <p className="text-xs text-muted-foreground">Pechuga de pollo orgánica - hace 5 minutos</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-10 px-3">
              <div className="text-right hidden lg:flex flex-col justify-center leading-none">
                <p className="text-sm font-medium truncate max-w-32">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()}</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profile?.photo || ""} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/perfil")}>Perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>Ajustes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  )
}
