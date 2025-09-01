
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Info, Home, ListChecks, DollarSign, Image as ImageIcon, ParkingCircle, Waves, ConciergeBell, Flame, CookingPot, Upload, Trash2, Loader2, User, AlertCircle } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { createProperty, getPropertyById, updateProperty } from '@/lib/properties';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/models/property';
import type { Agent } from '@/models/agent';
import { getAgents } from '@/lib/agents';
import { fileToDataUri } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Esquema de validación con Zod para todo el formulario
const propertyFormSchema = z.object({
  // Información Básica
  title: z.string().min(1, 'El título es requerido.'),
  location: z.string().min(1, 'La ciudad es requerida.'),
  address: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['Casa', 'Departamento', 'Local', 'Lote', 'Oficina', 'PH']),
  operation: z.enum(['Venta', 'Alquiler']),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),

  // Detalles
  bedrooms: z.coerce.number().min(0, "Debe ser un número positivo.").optional().or(z.literal('')),
  bathrooms: z.coerce.number().min(0, "Debe ser un número positivo.").optional().or(z.literal('')),
  area: z.coerce.number().min(0, "Debe ser un número positivo.").optional().or(z.literal('')),
  totalM2: z.coerce.number().min(0, "Debe ser un número positivo.").optional().or(z.literal('')),

  // Características
  features: z.object({
    cochera: z.boolean().default(false),
    piscina: z.boolean().default(false),
    dptoServicio: z.boolean().default(false),
    quincho: z.boolean().default(false),
    parrillero: z.boolean().default(false),
  }).default({}),

  // Precios
  priceUSD: z.coerce.number().min(0, "Debe ser un número positivo.").optional().or(z.literal('')),
  priceARS: z.coerce.number().min(0, "Debe ser un número positivo.").optional().or(z.literal('')),
  
  // Agente
  agentId: z.string().min(1, "Debe seleccionar un agente."),

});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const featureOptions = [
    { id: 'cochera', label: 'Cochera', icon: ParkingCircle },
    { id: 'piscina', label: 'Piscina', icon: Waves },
    { id: 'dptoServicio', label: 'Dpto. Servicio', icon: ConciergeBell },
    { id: 'quincho', label: 'Quincho', icon: Flame },
    { id: 'parrillero', label: 'Parrillero', icon: CookingPot },
] as const;


function PropertyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const propertyId = searchParams.get('id');
  const isEditing = !!propertyId;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageDataUris, setImageDataUris] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: '',
      location: 'San Fernando del Valle de Catamarca',
      address: '',
      description: '',
      type: 'Casa',
      operation: 'Venta',
      featured: false,
      active: true,
      bedrooms: '',
      bathrooms: '',
      area: '',
      totalM2: '',
      features: {
        cochera: false,
        piscina: false,
        dptoServicio: false,
        quincho: false,
        parrillero: false,
      },
      priceUSD: '',
      priceARS: '',
      agentId: '',
    },
  });

   useEffect(() => {
    async function loadInitialData() {
        try {
            const agentList = await getAgents();
            setAgents(agentList.filter(a => a.active));

            if (isEditing && propertyId) {
              const data = await getPropertyById(propertyId);
              if (data) {
                const values = {
                    ...data,
                    bedrooms: data.bedrooms ?? '',
                    bathrooms: data.bathrooms ?? '',
                    area: data.area ?? '',
                    totalM2: data.totalM2 ?? '',
                    priceUSD: data.priceUSD === 0 ? 0 : data.priceUSD || '',
                    priceARS: data.priceARS === 0 ? 0 : data.priceARS || '',
                }
                form.reset(values);
                if(data.images){
                    setImagePreviews(data.images.map(img => img.url));
                }
              } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Propiedad no encontrada.' });
                router.push('/admin?tab=properties');
              }
            }
        } catch (error) {
            console.error("Failed to load initial data", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos necesarios."})
        } finally {
            setLoading(false);
        }
    }
    loadInitialData();
   }, [isEditing, propertyId, form, router, toast]);


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files) {
          const files = Array.from(e.target.files);
          const dataUris = await Promise.all(files.map(fileToDataUri));
          setImageDataUris(dataUris);
          
          const newPreviews = files.map(file => URL.createObjectURL(file));
          setImagePreviews(newPreviews);
      }
  }

  const removeImage = (index: number) => {
      setImagePreviews(previews => previews.filter((_, i) => i !== index));
      setImageDataUris(dataUris => dataUris.filter((_, i) => i !== index));
  }


  async function onSubmit(data: PropertyFormValues) {
    setIsSubmitting(true);
    try {
        const selectedAgent = agents.find(agent => agent.id === data.agentId);
        if (!selectedAgent) {
            toast({ 
                variant: 'destructive', 
                title: 'Agente no válido', 
                description: 'Por favor, seleccione un agente de la lista para poder guardar la propiedad.' 
            });
            setIsSubmitting(false);
            return;
        }

        // CORRECT PAYLOAD CONSTRUCTION
        const propertyPayload = {
            title: data.title,
            description: data.description || '',
            priceUSD: Number(data.priceUSD) || 0,
            priceARS: Number(data.priceARS) || 0,
            type: data.type,
            operation: data.operation,
            location: data.location,
            address: data.address || '',
            bedrooms: Number(data.bedrooms) || 0,
            bathrooms: Number(data.bathrooms) || 0,
            area: Number(data.area) || 0,
            totalM2: Number(data.totalM2) || 0,
            featured: data.featured,
            active: data.active,
            agentId: data.agentId,
            contact: {
                name: selectedAgent.name,
                phone: selectedAgent.phone,
                email: selectedAgent.email,
            },
            features: data.features || { cochera: false, piscina: false, dptoServicio: false, quincho: false, parrillero: false },
        };

        if(isEditing && propertyId) {
            await updateProperty(propertyId, propertyPayload, imageDataUris.length > 0 ? imageDataUris : undefined);
            toast({ title: 'Propiedad Actualizada', description: 'Los cambios se guardaron correctamente.' });
        } else {
            if (imageDataUris.length === 0) {
              toast({ variant: 'destructive', title: 'Error', description: 'Debes subir al menos una imagen.' });
              setIsSubmitting(false);
              return;
            }
            await createProperty(propertyPayload, imageDataUris);
            toast({ title: 'Propiedad Creada', description: 'La nueva propiedad se ha guardado.' });
        }
        router.push('/admin?tab=properties');
        router.refresh();
    } catch (error) {
        console.error('Failed to save property:', error);
        toast({ variant: 'destructive', title: 'Error al guardar', description: 'No se pudo guardar la propiedad. Revise la consola para más detalles.' });
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

  if (!loading && agents.length === 0) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No hay agentes activos</AlertTitle>
                <AlertDescription>
                    No se puede crear o editar una propiedad porque no hay agentes activos en el sistema. 
                    Por favor, <Link href="/admin/agents/form" className="underline font-bold">crea un agente</Link> primero.
                </AlertDescription>
            </Alert>
        </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 mb-24">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin?tab=properties">
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
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="basic-info"><Info className="mr-2 h-4 w-4" /> Información Básica</TabsTrigger>
              <TabsTrigger value="details"><Home className="mr-2 h-4 w-4" /> Detalles</TabsTrigger>
              <TabsTrigger value="features"><ListChecks className="mr-2 h-4 w-4" /> Características</TabsTrigger>
              <TabsTrigger value="pricing"><DollarSign className="mr-2 h-4 w-4" /> Precios</TabsTrigger>
              <TabsTrigger value="images"><ImageIcon className="mr-2 h-4 w-4" /> Imágenes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-info" className="mt-6">
                <Card><CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Título*</FormLabel>
                            <FormControl><Input placeholder="Ej: Casa en Barrio Norte" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ciudad/Localidad*</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem>
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
                    <div className="md:col-span-2 flex items-center space-x-4">
                        <FormField control={form.control} name="featured" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Propiedad Destacada</FormLabel>
                                </div>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="active" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Activa</FormLabel>
                                </div>
                            </FormItem>
                        )}/>
                    </div>
                </div>
                </CardContent></Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
                <Card><CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Habitaciones</FormLabel>
                            <FormControl><Input type="number" placeholder="Ej: 3" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="bathrooms" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Baños</FormLabel>
                            <FormControl><Input type="number" placeholder="Ej: 2" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="area" render={({ field }) => (
                        <FormItem>
                            <FormLabel>M² cubiertos</FormLabel>
                            <FormControl><Input type="number" placeholder="Ej: 120" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="totalM2" render={({ field }) => (
                        <FormItem>
                            <FormLabel>M² totales</FormLabel>
                            <FormControl><Input type="number" placeholder="Ej: 300" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                </CardContent></Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
                <Card><CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {featureOptions.map((feature) => {
                        const Icon = feature.icon;
                        return (
                        <FormField
                            key={feature.id}
                            control={form.control}
                            name={`features.${feature.id}`}
                            render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-primary has-[:checked]:text-primary-foreground transition-colors">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="hidden"
                                    />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex flex-col items-center gap-2 w-full text-center">
                                    <Icon className="w-6 h-6"/>
                                    {feature.label}
                                </FormLabel>
                            </FormItem>
                            )}
                        />
                        )
                    })}
                    </div>
                </CardContent></Card>
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
                 <Card><CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="priceUSD" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio en dólares</FormLabel>
                                <FormControl><Input type="number" placeholder="Ej: 150000" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="priceARS" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio en pesos</FormLabel>
                                <FormControl><Input type="number" placeholder="Ej: 150000000" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <User className="h-5 w-5 text-blue-400 mt-0.5" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-blue-800 font-semibold mb-2">Asignar Agente</h3>
                                <FormField control={form.control} name="agentId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agente a Cargo*</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar un agente..."/></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {agents.map(agent => (
                                                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Seleccioná el agente responsable de esta propiedad.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        </div>
                    </div>
                 </CardContent></Card>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir o reemplazar imágenes</span></p>
                                    <p className="text-xs text-gray-500">PNG, JPG hasta 10MB cada una</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleImageChange} accept="image/png, image/jpeg" />
                            </label>
                        </div> 
                        <FormDescription className="mt-4 text-sm">
                            {isEditing 
                                ? "Subir nuevos archivos reemplazará todas las imágenes existentes. La primera imagen será la portada."
                                : "Mínimo 1 imagen. La primera imagen será la portada."}
                        </FormDescription>
                        
                        {imagePreviews.length > 0 && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative group aspect-square">
                                       <Image src={src} alt={`preview ${index}`} fill className="object-cover rounded-md" data-ai-hint="property image"/>
                                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="destructive" size="icon" type="button" onClick={() => removeImage(index)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                       </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

          </Tabs>

           <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t z-10">
                <div className="container mx-auto flex justify-end gap-4">
                    <Button type="button" variant="outline" size="lg" asChild>
                        <Link href="/admin?tab=properties">Cancelar</Link>
                    </Button>
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting 
                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                            : (isEditing ? 'Guardar Cambios' : 'Crear Propiedad')}
                    </Button>
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
}


export default function PropertyFormPage() {
    return (
        <Suspense fallback={<div>Cargando formulario...</div>}>
            <PropertyForm />
        </Suspense>
    )
}

    