
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Info, Home, ListChecks, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Esquema de validación con Zod, por ahora solo para la primera pestaña
const propertyFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  city: z.string().min(1, 'La ciudad es requerida.'),
  address: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['Casa', 'Departamento', 'Local', 'Lote', 'Oficina', 'PH']),
  operation: z.enum(['Venta', 'Alquiler']),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export default function PropertyFormPage() {
  // TODO: Cargar la propiedad si es una edición
  const isEditing = false; 

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: '',
      city: 'San Fernando del Valle de Catamarca',
      address: '',
      description: '',
      type: 'Casa',
      operation: 'Venta',
      featured: false,
      active: true,
    },
  });

  function onSubmit(data: PropertyFormValues) {
    // Lógica para guardar la propiedad
    console.log(data);
    // Mostrar un toast de éxito
  }
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
                <ArrowLeft />
            </Link>
        </Button>
        <h1 className="text-2xl font-bold font-headline ml-4">
            {isEditing ? 'Editar Propiedad' : 'Crear Nueva Propiedad'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic-info"><Info className="mr-2 h-4 w-4" /> Información Básica</TabsTrigger>
              <TabsTrigger value="details"><Home className="mr-2 h-4 w-4" /> Detalles</TabsTrigger>
              <TabsTrigger value="features"><ListChecks className="mr-2 h-4 w-4" /> Características</TabsTrigger>
              <TabsTrigger value="pricing"><DollarSign className="mr-2 h-4 w-4" /> Precios</TabsTrigger>
              <TabsTrigger value="images"><ImageIcon className="mr-2 h-4 w-4" /> Imágenes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-info" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título*</FormLabel>
                            <FormControl><Input placeholder="Ej: Casa en Barrio Norte" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ciudad*</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Dirección</FormLabel>
                            <FormControl><Input placeholder="Dirección completa" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Descripción</FormLabel>
                            <FormControl><Textarea placeholder="Describe la propiedad..." className="min-h-[120px]" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Propiedad*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Casa">Casa</SelectItem>
                                    <SelectItem value="Departamento">Departamento</SelectItem>
                                    <SelectItem value="Local">Local</SelectItem>
                                    <SelectItem value="Lote">Lote</SelectItem>
                                    <SelectItem value="Oficina">Oficina</SelectItem>
                                    <SelectItem value="PH">PH</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="operation" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Operación*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Venta">Venta</SelectItem>
                                    <SelectItem value="Alquiler">Alquiler</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <div className="flex items-center space-x-4">
                        <FormField control={form.control} name="featured" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Propiedad Destacada</FormLabel>
                                </div>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="active" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Activa</FormLabel>
                                </div>
                            </FormItem>
                        )}/>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="details">
                <p className="text-muted-foreground">Detalles de la propiedad. En construcción.</p>
            </TabsContent>
            <TabsContent value="features">
                <p className="text-muted-foreground">Características de la propiedad. En construcción.</p>
            </TabsContent>
            <TabsContent value="pricing">
                <p className="text-muted-foreground">Precios de la propiedad. En construcción.</p>
            </TabsContent>
             <TabsContent value="images">
                <p className="text-muted-foreground">Imágenes de la propiedad. En construcción.</p>
            </TabsContent>

          </Tabs>

           <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t z-10">
                <div className="container mx-auto flex justify-end gap-4">
                    <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancelar</Button>
                    <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting 
                            ? 'Guardando...' 
                            : (isEditing ? 'Guardar Cambios' : 'Crear Propiedad')}
                    </Button>
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
}
