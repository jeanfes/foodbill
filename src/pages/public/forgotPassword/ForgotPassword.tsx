import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Link } from "react-router-dom"
import LogoTransparent from "../../../assets/images/logoTransparent.png"

export default function ForgotPasswordForm() {
  const schema = z.object({
    email: z.string().email("Correo inválido"),
  })
  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    defaultValues: { email: "" },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Password reset request for:", values.email)
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Revisa tu correo</CardTitle>
          <CardDescription className="text-balance">
            Hemos enviado un enlace para restablecer la contraseña a <strong>{form.getValues("email")}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            ¿No recibiste el correo? Revisa la carpeta de spam o inténtalo de nuevo.
          </p>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsSubmitted(false)}>
            Probar con otro correo
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            to="/login"
            className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a iniciar sesión
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto mt-2">
            <img src={LogoTransparent} alt="logo" className="authLogoSmall w-18 h-18 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Restablecer contraseña</CardTitle>
          <CardDescription className="text-balance">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" placeholder="orlando@reztro.com" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar enlace"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a iniciar sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
