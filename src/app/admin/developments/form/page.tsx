
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Info, Building, DollarSign, Image as ImageIcon, Upload, Trash2, Loader2, Calendar } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { Development } from '@/models/development';
import { createDevelopment, getDevelopmentById, updateDevelopment } from '@/lib/developments';
import { fileToDataUri } from '@/lib/utils';

const developmentFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  location: z.string().min(1, 'La ubicación es requerida.'),
  description: z.string().optional(),
  status: z.enum(['planning', 'construction', 'finished']),
  isFeatured: z.boolean().default(false),
  totalUnits: z.coerce.number().min(1, 'Debe haber al menos una unidad.'),
  availableUnits: z.coerce.number().min(0, 'No puede ser negativo.'),
  priceFrom: z.coerce.number().min(0, 'El precio debe ser positivo.').optional().or(z.literal('')),
  priceRange: z.object({
      min: z.coerce.number().min(0, "Debe ser un número positivo.").optional().or(z.literal('')),
      max: z.coerce.number().min(0, "Debe ser un número positivo.").optional().or(z.literal('')),
  }),
  deliveryDate: z.string().min(1, 'La fecha de entrega es requerida.'),
}).refine(data => {
    if (data.availableUnits === undefined || data.totalUnits === undefined) return true;
    return data.availableUnits <= data.totalUnits;
}, {
    message: "Las unidades disponibles no pueden ser mayores a las totales.",
    path: ["availableUnits"],
});


type DevelopmentFormValues = z.infer<typeof developmentFormSchema>;

function DevelopmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const developmentId = searchParams.get('id');
  const isEditing = !!developmentId;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageDataUri, setImageDataUri] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<DevelopmentFormValues>({
    resolver: zodResolver(developmentFormSchema),
    defaultValues: {
      title: '',
      location: 'San Fernando del Valle de Catamarca',
      description: '',
      status: 'planning',
      isFeatured: false,
      totalUnits: 10,
      availableUnits: 10,
      priceFrom: '',
      priceRange: { min: '', max: ''},
      deliveryDate: 'Consultar',
    },
  });

  useEffect(() => {
    async function loadDev() {
      if (isEditing) {
        const data = await getDevelopmentById(developmentId);
        if (data) {
          const values = {
              ...data,
              priceFrom: data.priceFrom || '',
              priceRange: {
                  min: data.priceRange?.min || '',
                  max: data.priceRange?.max || '',
              }
          }
          form.reset(values);
          if(data.image){
              setImagePreview(data.image);
          }
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Emprendimiento no encontrado.' });
          router.push('/admin?tab=developments');
        }
      }
      setLoading(false);
    }
    loadDev();
   }, [isEditing, developmentId, form, router, toast]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const dataUri = await fileToDataUri(file);
          setImageDataUri(dataUri);
          setImagePreview(URL.createObjectURL(file));
      }
  }

  const removeImage = () => {
      setImageDataUri(undefined);
      setImagePreview(null);
  }

  async function onSubmit(data: DevelopmentFormValues) {
    setIsSubmitting(true);
    try {
        if(isEditing) {
            await updateDevelopment(developmentId, data, imageDataUri);
            toast({ title: 'Emprendimiento Actualizado', description: 'Los cambios se guardaron correctamente.' });
        } else {
            if (!imageDataUri) {
              toast({ variant: 'destructive', title: 'Error', description: 'Debes subir una imagen.' });
              setIsSubmitting(false);
              return;
            }
            await createDevelopment(data, imageDataUri);
            toast({ title: 'Emprendimiento Creado', description: 'El nuevo emprendimiento se ha guardado.' });
        }
        router.push('/admin?tab=developments');
        router.refresh();
    } catch (error) {
        console.error('Failed to save development:', error);
        toast({ variant: 'destructive', title: 'Error al guardar', description: 'No se pudo guardar el emprendimiento.' });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (loading) {
      return (
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
              <Loader2 className="h-10 w-10 animate-spin" />
          </div>
      )
  }
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 mb-24">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin?tab=developments">
                <ArrowLeft />
            </Link>
        </Button>
        <h1 className="text-2xl font-bold font-headline ml-4">
            {isEditing ? 'Editar Emprendimiento' : 'Crear Nuevo Emprendimiento'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Título del Emprendimiento*</FormLabel>
                            <FormControl><Input placeholder="Ej: Complejo Residencial Altos del Valle" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ubicación*</FormLabel>
                            <FormControl><Input placeholder="Ciudad, Barrio" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha de Entrega*</FormLabel>
                            <FormControl><Input placeholder="Ej: Diciembre 2025, Inmediata, etc." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Descripción</FormLabel>
                            <FormControl><Textarea placeholder="Describe el emprendimiento..." className="min-h-[120px]" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="planning">En Planificación / Pozo</SelectItem>
                                    <SelectItem value="construction">En Construcción</SelectItem>
                                    <SelectItem value="finished">Finalizado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="isFeatured" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 self-end">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Emprendimiento Destacado</FormLabel>
                            </div>
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader><CardTitle>Unidades y Precios</CardTitle></CardHeader>
                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="totalUnits" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unidades Totales*</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="availableUnits" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unidades Disponibles*</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="priceFrom" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Precio Desde (USD)</FormLabel>
                            <FormControl><Input type="number" placeholder="100000" {...field} /></FormControl>
                             <FormDescription>Precio de la unidad más económica.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="priceRange.min" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rango Mín. (USD)</FormLabel>
                                <FormControl><Input type="number" placeholder="80000" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="priceRange.max" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rango Máx. (USD)</FormLabel>
                                <FormControl><Input type="number" placeholder="250000" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Imagen Principal</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir imagen</span></p>
                                <p className="text-xs text-gray-500">PNG o JPG (hasta 5MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg" />
                        </label>
                    </div> 
                    <FormDescription className="mt-4 text-sm">
                        {isEditing 
                            ? "Subir un nuevo archivo reemplazará la imagen existente."
                            : "Sube la imagen principal del emprendimiento."}
                    </FormDescription>
                    
                    {imagePreview && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Vista Previa:</h4>
                            <div className="relative group aspect-video w-full max-w-sm">
                               <Image src={imagePreview} alt="Vista previa" fill className="object-cover rounded-md" data-ai-hint="building exterior" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="destructive" size="icon" type="button" onClick={removeImage}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                               </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

           <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t z-10">
                <div className="container mx-auto flex justify-end gap-4">
                    <Button type="button" variant="outline" size="lg" asChild>
                        <Link href="/admin?tab=developments">Cancelar</Link>
                    </Button>
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting
                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                            : (isEditing ? 'Guardar Cambios' : 'Crear Emprendimiento')}
                    </Button>
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
}

export default function DevelopmentFormPage() {
    return (
        <Suspense fallback={<div>Cargando formulario...</div>}>
            <DevelopmentForm />
        </Suspense>
    )
}
