import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Link } from "react-router-dom"
import LogoTransparent from "../../../assets/images/logoTransparent.png"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Password reset request for:", email)
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
            Hemos enviado un enlace para restablecer la contraseña a <strong>{email}</strong>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="orlando@reztro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar enlace"}
            </Button>
          </form>
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
