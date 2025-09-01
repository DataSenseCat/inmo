
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { authenticateAdmin, isFirstAdmin, createFirstAdmin } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Por favor, ingrese un email válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isCheckingFirstAdmin, setIsCheckingFirstAdmin] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useState(() => {
    async function checkFirstAdmin() {
      const first = await isFirstAdmin();
      setIsFirstRun(first);
      setIsCheckingFirstAdmin(false);
    }
    checkFirstAdmin();
  });

  async function onSubmit(data: LoginFormValues) {
    setError(null);
    try {
      if (isFirstRun) {
        await createFirstAdmin(data);
        toast({
          title: "Administrador Creado",
          description: "Tu cuenta de administrador ha sido creada. Ahora puedes iniciar sesión con esas credenciales.",
        });
        // After creating, set isFirstRun to false so the next attempt is a login
        setIsFirstRun(false); 
        // We don't log in automatically to ensure the user knows the credentials they just created.
        return; 
      }

      const authenticated = await authenticateAdmin(data);

      if (authenticated) {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        toast({
          title: "Inicio de Sesión Exitoso",
          description: "Bienvenido al panel de administración.",
        });
        router.replace('/admin');
      } else {
        setError("Las credenciales son incorrectas. Por favor, intente de nuevo.");
      }
    } catch (e: any) {
       console.error("Login error:", e);
       setError(e.message || "Ocurrió un error inesperado durante el inicio de sesión.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Panel de Administración</CardTitle>
          <CardDescription>
            {isFirstRun ? "Crea tu cuenta de administrador" : "Inicia sesión para gestionar la inmobiliaria."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error de Autenticación</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
               {isFirstRun && !isCheckingFirstAdmin && (
                 <Alert variant="default" className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-700" />
                    <AlertTitle className="text-blue-800">¡Configuración Inicial!</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        No se han encontrado administradores. Ingresa el email y la contraseña que deseas usar para crear tu primera cuenta de administrador.
                    </AlertDescription>
                </Alert>
               )}
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isCheckingFirstAdmin}>
                    {form.formState.isSubmitting 
                        ? "Procesando..." 
                        : (isFirstRun ? "Crear Administrador" : "Ingresar")
                    }
                  </Button>
                </>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
