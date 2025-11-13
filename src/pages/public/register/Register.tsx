import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LogoTransparent from "../../../assets/images/logoTransparent.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export default function Register() {
  const schema = z.object({
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Mínimo 4 caracteres"),
    confirmPassword: z.string().min(6, "Mínimo 4 caracteres"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Register attempt:", values)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto mt-2">
            <img src={LogoTransparent} alt="logo" className="authLogoSmall w-18 h-18 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Crear una cuenta</CardTitle>
          <CardDescription className="text-balance">Regístrate para gestionar tu restaurante eficientemente</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="text-sm mb-1.5 block">Correo electrónico</FormLabel>
                    <FormControl>
                      <Input className="h-10" id="email" type="email" placeholder="orlando@reztro.com" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password" className="text-sm mb-1.5 block">Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput className="h-10" id="password" placeholder="••••••••" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword" className="text-sm mb-1.5 block">Confirmar contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput className="h-10" id="confirmPassword" placeholder="••••••••" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-9" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
