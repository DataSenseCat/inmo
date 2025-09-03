
'use client';

import { useEffect, useState, Suspense, useActionState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, User, Mail, Phone, Upload, Trash2, Loader2, AlertCircle } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { Agent } from '@/models/agent';
import { getAgentById, saveAgent, type AgentActionResponse } from '@/lib/agents';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { fileToDataUri } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const agentFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  email: z.string().email('Por favor, ingrese un email válido.'),
  phone: z.string().min(1, 'El teléfono es requerido.'),
  active: z.boolean().default(true),
  bio: z.string().optional(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

function AgentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const agentId = searchParams.get('id');
  const isEditing = !!agentId;

  const [loading, setLoading] = useState(isEditing);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | undefined>(undefined);
  
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: AgentActionResponse = { success: false, message: '' };
  const [state, formAction, isSubmitting] = useActionState(saveAgent, initialState);
  
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      active: true,
      bio: '',
    },
  });

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getAgentById(agentId)
        .then(data => {
          if (data) {
            form.reset({
                ...data,
                bio: data.bio || '',
            });
            if(data.photoUrl){
                setImagePreview(data.photoUrl);
            }
          } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Agente no encontrado.' });
            router.push('/admin?tab=agents');
          }
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
   }, [isEditing, agentId, form, router, toast]);

    useEffect(() => {
        if (state.success) {
            toast({ title: isEditing ? 'Agente Actualizado' : 'Agente Creado', description: state.message });
            router.push('/admin?tab=agents');
            router.refresh();
        }
   }, [state, toast, router, isEditing]);


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const dataUri = await fileToDataUri(file);
          setPhotoDataUri(dataUri);
          setImagePreview(URL.createObjectURL(file));
      }
  }

  const removeImage = () => {
      setPhotoDataUri(undefined);
      setImagePreview(null);
  }
  
  const handleFormAction = (formData: FormData) => {
    if (isEditing) {
        formData.append('id', agentId);
    }
    if (photoDataUri) {
        formData.append('photoDataUri', photoDataUri);
    }
    formAction(formData);
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
            <Link href="/admin?tab=agents">
                <ArrowLeft />
            </Link>
        </Button>
        <h1 className="text-2xl font-bold font-headline ml-4">
            {isEditing ? 'Editar Agente' : 'Crear Nuevo Agente'}
        </h1>
      </div>
      
      <Form {...form}>
        <form 
            ref={formRef}
            action={handleFormAction}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader><CardTitle>Información del Agente</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Completo*</FormLabel>
                                <FormControl><Input placeholder="Ej: Maria Rodríguez" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email*</FormLabel>
                                <FormControl><Input type="email" placeholder="maria@email.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono*</FormLabel>
                                <FormControl><Input placeholder="+54 9 383 123 4567" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="bio" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Biografía</FormLabel>
                                <FormControl><Textarea placeholder="Una breve descripción sobre el agente, su experiencia, etc." {...field} /></FormControl>
                                <FormDescription>Esta biografía se mostrará en la página "La Empresa".</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="active" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} name={field.name} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Agente Activo</FormLabel>
                                    <FormDescription>Desmarcar si el agente ya no está activo en la inmobiliaria.</FormDescription>
                                </div>
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader><CardTitle>Foto de Perfil</CardTitle></CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <Avatar className="h-40 w-40">
                            <AvatarImage src={imagePreview ?? undefined} alt="Vista previa del agente" />
                            <AvatarFallback><User className="h-20 w-20" /></AvatarFallback>
                        </Avatar>

                        <div className="w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full py-4 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center">
                                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                    <p className="text-sm text-gray-500 text-center"><span className="font-semibold">Click para subir foto</span></p>
                                    <p className="text-xs text-gray-500">PNG o JPG</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg" />
                            </label>
                        </div> 
                        
                        {imagePreview && (
                            <Button variant="destructive" type="button" onClick={removeImage} className="w-full">
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Quitar Imagen
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {state && !state.success && state.message && (
                <div className="lg:col-span-3">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error al Guardar</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            <div className="lg:col-span-3 fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t z-10">
                <div className="container mx-auto flex justify-end gap-4">
                    <Button type="button" variant="outline" size="lg" asChild>
                        <Link href="/admin?tab=agents">Cancelar</Link>
                    </Button>
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting
                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                            : (isEditing ? 'Guardar Cambios' : 'Crear Agente')}
                    </Button>
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
}

export default function AgentFormPage() {
    return (
        <Suspense fallback={<div>Cargando formulario...</div>}>
            <AgentForm />
        </Suspense>
    )
}
