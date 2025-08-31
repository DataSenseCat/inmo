
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, Upload, Trash2 } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import type { SiteConfig } from '@/models/site-config';
import { getSiteConfig, updateSiteConfig } from '@/lib/config';
import Image from 'next/image';

const configFormSchema = z.object({
  contactPhone: z.string().min(1, 'El teléfono es requerido.'),
  contactEmail: z.string().email('Por favor, ingrese un email válido.'),
  leadNotificationEmail: z.string().email('Por favor, ingrese un email válido.').optional().or(z.literal('')),
  address: z.string().min(1, 'La dirección es requerida.'),
  officeHours: z.string().min(1, 'El horario es requerido.'),
  facebookUrl: z.string().url().or(z.literal('')),
  instagramUrl: z.string().url().or(z.literal('')),
  twitterUrl: z.string().url().or(z.literal('')),
});

type ConfigFormValues = z.infer<typeof configFormSchema>;

function ConfigForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [currentConfig, setCurrentConfig] = useState<SiteConfig | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      contactPhone: '',
      contactEmail: '',
      leadNotificationEmail: '',
      address: '',
      officeHours: '',
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
    },
  });

  useEffect(() => {
    setLoading(true);
    getSiteConfig()
      .then(data => {
        if (data) {
            setCurrentConfig(data);
            form.reset({
                contactPhone: data.contactPhone || '',
                contactEmail: data.contactEmail || '',
                leadNotificationEmail: data.leadNotificationEmail || '',
                address: data.address || '',
                officeHours: data.officeHours || '',
                facebookUrl: data.socials?.facebook || '',
                instagramUrl: data.socials?.instagram || '',
                twitterUrl: data.socials?.twitter || '',
            });
            if(data.logoUrl) {
                setLogoPreview(data.logoUrl);
            }
        }
      })
      .finally(() => setLoading(false));
   }, [form]);

   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setLogoFile(file);
          setLogoPreview(URL.createObjectURL(file));
      }
  }

  const removeLogo = () => {
      setLogoFile(null);
      setLogoPreview(null);
  }

  async function onSubmit(data: ConfigFormValues) {
    try {
        const configToSave = {
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          leadNotificationEmail: data.leadNotificationEmail,
          address: data.address,
          officeHours: data.officeHours,
          socials: {
            facebook: data.facebookUrl,
            instagram: data.instagramUrl,
            twitter: data.twitterUrl,
          },
        };

        const wasLogoRemoved = !logoPreview && !!currentConfig?.logoUrl;

        await updateSiteConfig(configToSave, currentConfig, logoFile || undefined, wasLogoRemoved);
        
        toast({ title: 'Configuración Actualizada', description: 'Los cambios se guardaron correctamente.' });
        router.push('/admin?tab=config');
        router.refresh();
    } catch (error) {
        console.error('Failed to save config:', error);
        toast({ variant: 'destructive', title: 'Error al guardar', description: 'No se pudo guardar la configuración.' });
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
            <Link href="/admin?tab=config">
                <ArrowLeft />
            </Link>
        </Button>
        <h1 className="text-2xl font-bold font-headline ml-4">
            Editar Configuración del Sitio
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Logo de la Empresa</CardTitle></CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    {logoPreview && (
                        <div className="bg-muted p-4 rounded-lg w-full max-w-sm h-28 relative">
                           <Image src={logoPreview} alt="Vista previa del logo" fill className="object-contain" />
                        </div>
                    )}
                     <div className="w-full max-w-sm">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full py-4 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center">
                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="text-sm text-gray-500 text-center"><span className="font-semibold">Click para subir logo</span></p>
                                <p className="text-xs text-gray-500">PNG o JPG</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleLogoChange} accept="image/png, image/jpeg" />
                        </label>
                    </div> 
                    {logoPreview && (
                        <Button variant="destructive" type="button" onClick={removeLogo}>
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Quitar Logo
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Información de Contacto</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="contactPhone" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teléfono Principal*</FormLabel>
                            <FormControl><Input placeholder="+54 9 383 123 4567" {...field} /></FormControl>
                            <FormDescription>Este teléfono se mostrará en todo el sitio.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="contactEmail" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Principal*</FormLabel>
                            <FormControl><Input type="email" placeholder="info@email.com" {...field} /></FormControl>
                            <FormDescription>El email de contacto general de la empresa.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="leadNotificationEmail" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email de Notificación de Leads</FormLabel>
                            <FormControl><Input type="email" placeholder="leads@email.com" {...field} /></FormControl>
                            <FormDescription>La dirección de email donde se recibirán las notificaciones de nuevos contactos.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección de la Oficina*</FormLabel>
                            <FormControl><Textarea placeholder="Av. Siempre Viva 123, Springfield" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="officeHours" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Horarios de Atención*</FormLabel>
                            <FormControl><Input placeholder="Lun-Vie: 9-18, Sáb: 9-13" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Redes Sociales</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de Facebook</FormLabel>
                            <FormControl><Input placeholder="https://facebook.com/tu_pagina" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="instagramUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de Instagram</FormLabel>
                            <FormControl><Input placeholder="https://instagram.com/tu_usuario" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de Twitter / X</FormLabel>
                            <FormControl><Input placeholder="https://x.com/tu_usuario" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>

            <div className="lg:col-span-3 fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t z-10">
                <div className="container mx-auto flex justify-end gap-4">
                    <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancelar</Button>
                    <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting 
                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                            : <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</>}
                    </Button>
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
}

export default function ConfigFormPage() {
    return (
        <Suspense fallback={<div>Cargando formulario...</div>}>
            <ConfigForm />
        </Suspense>
    )
}

    
