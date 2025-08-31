
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { Testimonial } from '@/models/testimonial';
import { createTestimonial, getTestimonialById, updateTestimonial } from '@/lib/testimonials';

const testimonialFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres.'),
  rating: z.coerce.number().min(1).max(5),
  active: z.boolean().default(true),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

function TestimonialForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const testimonialId = searchParams.get('id');
  const isEditing = !!testimonialId;

  const [loading, setLoading] = useState(isEditing);
  const [testimonialData, setTestimonialData] = useState<Testimonial | null>(null);
  
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: '',
      comment: '',
      rating: 5,
      active: true,
    },
  });

  useEffect(() => {
    if (isEditing && !testimonialData) {
      setLoading(true);
      getTestimonialById(testimonialId)
        .then(data => {
          if (data) {
            setTestimonialData(data);
            form.reset(data);
          } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Testimonio no encontrado.' });
            router.push('/admin?tab=testimonials');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isEditing, testimonialId, form, router, toast, testimonialData]);

  async function onSubmit(data: TestimonialFormValues) {
    try {
      if (isEditing) {
        await updateTestimonial(testimonialId, data);
        toast({ title: 'Testimonio Actualizado', description: 'Los cambios se guardaron correctamente.' });
      } else {
        await createTestimonial(data);
        toast({ title: 'Testimonio Creado', description: 'El nuevo testimonio se ha guardado.' });
      }
      router.push('/admin?tab=testimonials');
      router.refresh();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
      toast({ variant: 'destructive', title: 'Error al guardar', description: 'No se pudo guardar el testimonio.' });
    }
  }

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 mb-24">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin?tab=testimonials">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold font-headline ml-4">
          {isEditing ? 'Editar Testimonio' : 'Crear Nuevo Testimonio'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
          <Card>
            <CardHeader><CardTitle>Información del Testimonio</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Cliente*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentario*</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Escribe el testimonio del cliente aquí..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calificación*</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                key={star}
                                className={`w-8 h-8 cursor-pointer transition-colors ${
                                    field.value >= star
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                onClick={() => field.onChange(star)}
                                />
                            ))}
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Testimonio Activo</FormLabel>
                      <FormDescription>
                        Desmarcar para ocultar este testimonio del sitio web público.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t z-10">
            <div className="container mx-auto flex justify-end gap-4 max-w-2xl">
              <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting 
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                  : <><Save className="mr-2 h-4 w-4" /> {isEditing ? 'Guardar Cambios' : 'Crear Testimonio'}</>}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function TestimonialFormPage() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <TestimonialForm />
    </Suspense>
  );
}
