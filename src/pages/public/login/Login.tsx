import React from "react"
import { Link, useNavigate } from "react-router-dom"
import LogoTransparent from "../../../assets/images/logoTransparent.png"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { PasswordInput } from "../../../components/ui/password-input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "./hooks/useLogin"

const Login = () => {
  const schema = z.object({
    dependencia: z.string().min(1, "Selecciona una dependencia"),
    username: z.string().min(1, "Usuario requerido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
  })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      dependencia: "",
      username: "",
      password: "",
    },
    mode: "onSubmit",
  })
  const [errorMessage, setErrorMessage] = React.useState("")
  const navigate = useNavigate()
  const { loginUser, loading, error } = useLogin()

  const onSubmit = async (values: FormValues) => {
    setErrorMessage("")
    const result = await loginUser({
      identification_number: values.username,
      password: values.password,
      dependencia: values.dependencia,
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {(errorMessage || error) && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive text-center">{errorMessage || error}</p>
                </div>
              )}
              <FormField
                control={form.control}
                name="dependencia"
                render={({ field }) => (
                  <FormItem className="w-full space-y-2">
                    <FormLabel>Dependencia</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="username">Usuario</FormLabel>
                    <FormControl>
                      <Input id="username" type="text" placeholder="admin" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        ¿Olvidaste la contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput id="password" placeholder="••••••••" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </Form>
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