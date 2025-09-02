
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
        <Card className="max-w-2xl mx-auto mt-16 border-destructive">
            <CardHeader className="text-center">
                <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="mt-4 text-2xl text-destructive">Ocurrió un Error Inesperado</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                    Algo salió mal al intentar procesar tu solicitud en el formulario de propiedades. Nuestro equipo técnico ha sido notificado.
                </p>
                <div className="bg-muted p-3 rounded-md text-left text-xs text-muted-foreground overflow-auto">
                    <p><strong>Mensaje:</strong> {error.message}</p>
                    {error.digest && <p><strong>Código de error:</strong> {error.digest}</p>}
                </div>
                <Button
                    onClick={() => reset()}
                    className="mt-6"
                >
                    Intentar de Nuevo
                </Button>
            </CardContent>
        </Card>
    </div>
  )
}
