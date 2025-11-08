import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import LogoTransparent from "../../../assets/images/logoTransparent.png"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { PasswordInput } from "../../../components/ui/password-input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { useLogin } from "./hooks/useLogin"

const Login = () => {
  const [dependencia, setDependencia] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const { loginUser, loading, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    const result = await loginUser({
      identification_number: username,
      password: password,
      dependencia: dependencia,
    })

    if (result.success) {
      navigate("/home")
    } else {
      setErrorMessage(result.message || "Error al iniciar sesión")
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto mt-2">
            <img src={LogoTransparent} alt="logo" className="authLogoSmall w-18 h-18 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Bienvenido de nuevo</CardTitle>
          <CardDescription className="text-balance">Inicia sesión en tu cuenta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(errorMessage || error) && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{errorMessage || error}</p>
              </div>
            )}
            <div className="w-full space-y-2">
              <Label htmlFor="dependencia">Dependencia</Label>
              <Select value={dependencia} onValueChange={setDependencia} disabled={loading}>
                <SelectTrigger id="dependencia">
                  <SelectValue placeholder="Selecciona una dependencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cocina">Cocina</SelectItem>
                  <SelectItem value="meseros">Meseros</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="administracion">Administración</SelectItem>
                  <SelectItem value="gerencia">Gerencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste la contraseña?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {"¿No tienes una cuenta? "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login