

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Check, Phone, MessageSquare, Mail, MapPin, Clock, Send, Building, Home, Briefcase, FileText, Calendar } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { createLead } from "@/lib/leads";
import { getSiteConfig } from "@/lib/config";
import { useEffect, useState } from "react";
import type { SiteConfig } from "@/models/site-config";

const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre es requerido."),
  email: z.string().email("Por favor, ingrese un email válido."),
  phone: z.string().optional(),
  contactPreference: z.enum(["email", "phone", "whatsapp"]),
  subject: z.string().min(1, "Debe seleccionar un asunto."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const departments = [
    { icon: Home, title: "Ventas", email: "ventas@inmobiliariacatamarca.com", phone: "+54 383 456-7890" },
    { icon: Briefcase, title: "Alquileres", email: "alquileres@inmobiliariacatamarca.com", phone: "+54 383 456-7891" },
    { icon: FileText, title: "Tasaciones", email: "tasaciones@inmobiliariacatamarca.com", phone: "+54 383 456-7892" },
    { icon: Building, title: "Administración", email: "admin@inmobiliariacatamarca.com", phone: "+54 383 456-7893" },
];

const faqs = [
    {
        question: "¿Cuál es el horario de atención?",
        answer: "Atendemos de lunes a viernes de 9:00 a 18:00 y sábados de 9:00 a 13:00. Por WhatsApp respondemos las 24 horas."
    },
    {
        question: "¿Hacen tasaciones gratuitas?",
        answer: "Sí, todas nuestras tasaciones son completamente gratuitas y sin compromiso para propiedades en Catamarca."
    },
    {
        question: "¿En qué zonas operan?",
        answer: "Operamos en toda la provincia de Catamarca, con foco principal en San Fernando del Valle de Catamarca y alrededores."
    },
    {
        question: "¿Cómo puedo publicar mi propiedad?",
        answer: "Podés contactarnos por cualquier medio y programaremos una visita gratuita para evaluar tu propiedad y proponerte un plan de comercialización."
    },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    getSiteConfig().then(setConfig);
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      contactPreference: "email",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      await createLead(data);
      toast({
        title: "Mensaje Enviado!",
        description: "Gracias por contactarte. Te responderemos a la brevedad.",
      });
      form.reset();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        variant: 'destructive',
        title: 'Error al enviar',
        description: 'No se pudo enviar tu mensaje. Por favor, intentá de nuevo más tarde.',
      });
    }
  }

  const contactOptions = [
    {
        icon: Phone,
        title: "Teléfono",
        info: config?.contactPhone || 'Cargando...',
        subInfo: "Lunes a Viernes de 9 a 18hs",
        buttonText: "Llamar",
        href: `tel:${config?.contactPhone}`
    },
    {
        icon: MessageSquare,
        title: "WhatsApp",
        info: config?.contactPhone || 'Cargando...',
        subInfo: "Respuesta inmediata",
        buttonText: "Chatear",
        href: `https://wa.me/${config?.contactPhone?.replace(/\s|-/g, '')}`
    },
    {
        icon: Mail,
        title: "Email",
        info: config?.contactEmail || 'Cargando...',
        subInfo: "Respuesta en 24hs",
        buttonText: "Escribir",
        href: `mailto:${config?.contactEmail}`
    },
    {
        icon: MapPin,
        title: "Oficina",
        info: config?.address.split(',')[0] || 'Cargando...',
        subInfo: config?.address.split(',').slice(1).join(',') || '',
        buttonText: "Ver Mapa",
        href: "#map-location"
    },
];

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Contactános</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                ¿Tenés alguna consulta? Nos encantaría ayudarte. Contáctanos a través de cualquiera de nuestros canales de comunicación y te responderemos a la brevedad.
            </p>
            <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50"><Check className="mr-1.5 h-4 w-4"/>Respuesta rápida</Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50"><Check className="mr-1.5 h-4 w-4"/>Atención personalizada</Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50"><Check className="mr-1.5 h-4 w-4"/>Asesoramiento gratuito</Badge>
            </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-16">
            <h2 className="text-2xl font-bold font-headline text-center mb-8">Formas de Contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {contactOptions.map((option, i) => {
                    const Icon = option.icon
                    return (
                        <Card key={i} className="text-center p-6 flex flex-col items-center">
                            <div className="mb-4 text-primary bg-primary/10 rounded-full p-3">
                                <Icon className="h-7 w-7"/>
                            </div>
                            <h3 className="font-semibold text-lg">{option.title}</h3>
                            <p className="text-muted-foreground text-sm">{option.info}</p>
                            <p className="text-muted-foreground text-xs">{option.subInfo}</p>
                            <Button asChild className="mt-4 w-full">
                                <a href={option.href} target="_blank" rel="noopener noreferrer">{option.buttonText}</a>
                            </Button>
                        </Card>
                    )
                })}
            </div>
        </div>

        {/* Form & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <Card className="p-6 sm:p-8">
                <CardHeader className="p-0 mb-6">
                    <CardTitle className="font-headline text-2xl">Envíanos un Mensaje</CardTitle>
                    <CardDescription>Completá el formulario y nos contactaremos contigo en las próximas 24 horas.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre completo</FormLabel>
                                    <FormControl><Input placeholder="Tu nombre completo" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}/>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="tu@email.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}/>
                            </div>
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono (opcional)</FormLabel>
                                    <FormControl><Input placeholder="+54 383 456 7890" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="contactPreference" render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>¿Cómo preferís que te contactemos?</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row gap-4">
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="email" /></FormControl>
                                                <FormLabel className="font-normal">Email</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="phone" /></FormControl>
                                                <FormLabel className="font-normal">Llamada telefónica</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="whatsapp" /></FormControl>
                                                <FormLabel className="font-normal">WhatsApp</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            
                            <FormField control={form.control} name="subject" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asunto</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar asunto" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="consulta-venta">Consulta por venta</SelectItem>
                                            <SelectItem value="consulta-alquiler">Consulta por alquiler</SelectItem>
                                            <SelectItem value="solicitar-tasacion">Solicitar tasación</SelectItem>
                                            <SelectItem value="consulta-emprendimiento">Consulta por emprendimiento</SelectItem>
                                            <SelectItem value="otro">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                            <FormField control={form.control} name="message" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mensaje</FormLabel>
                                    <FormControl><Textarea placeholder="Contanos en qué podemos ayudarte..." className="min-h-[120px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full" size="lg">
                                {form.formState.isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                            </Button>
                             <div className="text-center mt-4 border-t pt-4">
                                <p className="text-sm text-muted-foreground mb-3">¿Preferís contactarnos directamente?</p>
                                <div className="flex justify-center gap-3">
                                    <Button variant="outline" asChild><a href={`https://wa.me/${config?.contactPhone?.replace(/\s|-/g, '')}`} target="_blank"><MessageSquare className="mr-2"/>WhatsApp</a></Button>
                                    <Button variant="outline" asChild><a href={`mailto:${config?.contactEmail}`}><Mail className="mr-2"/>Email</a></Button>
                                    <Button variant="outline" asChild><a href={`tel:${config?.contactPhone}`}><Phone className="mr-2"/>Llamar</a></Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><MapPin className="text-primary"/> Información de la Oficina</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <h4 className="font-semibold text-muted-foreground text-sm">Dirección</h4>
                        <p>{config?.address || 'Cargando...'}</p>
                     </div>
                     <div>
                        <h4 className="font-semibold text-muted-foreground text-sm">Horarios de Atención</h4>
                        <p className="flex items-center gap-2"><Clock className="w-4 h-4"/> {config?.officeHours || 'Cargando...'}</p>
                     </div>
                     <div>
                        <h4 className="font-semibold text-muted-foreground text-sm">Cómo llegar</h4>
                        <p className="text-sm">Estamos ubicados en pleno centro de la ciudad, cerca de bancos y comercios principales.</p>
                        <Button variant="link" className="p-0 h-auto mt-1" asChild>
                            <a href="https://maps.google.com" target="_blank">Ver en Google Maps <Send className="ml-2 h-3 w-3"/></a>
                        </Button>
                     </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Building className="text-primary"/> Departamentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {departments.map((dep, i) => {
                        const Icon = dep.icon;
                        return (
                            <div key={i} className="border-t pt-4 first:border-t-0 first:pt-0">
                                <h4 className="font-semibold flex items-center gap-2"><Icon className="h-4 w-4 text-primary"/>{dep.title}</h4>
                                <p className="text-sm text-muted-foreground">Consultas sobre {dep.title.toLowerCase()}</p>
                                <div className="flex gap-4 mt-1">
                                    <a href={`mailto:${dep.email}`} className="text-sm text-primary hover:underline flex items-center gap-1.5"><Mail className="h-3 w-3"/>{dep.email}</a>
                                    <a href={`tel:${dep.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1.5"><Phone className="h-3 w-3"/>{dep.phone}</a>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Location Section */}
        <div id="map-location" className="mt-16 lg:mt-24">
            <h2 className="text-2xl font-bold font-headline text-center mb-8">Nuestra Ubicación</h2>
            <div className="aspect-[16/9] md:aspect-[16/6] bg-muted rounded-lg overflow-hidden relative border">
                <Image src="https://picsum.photos/1200/400" fill alt="Mapa de ubicación" className="object-cover" data-ai-hint="city map" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <a href="https://maps.google.com" target="_blank" className="p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                        <MapPin className="h-8 w-8 text-white"/>
                    </a>
                </div>
            </div>
        </div>

         {/* FAQ Section */}
        <div className="mt-16 lg:mt-24">
             <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Preguntas Frecuentes</h2>
                <p className="text-muted-foreground mt-2">
                    Resolvemos las dudas más comunes. Si no encontrás la respuesta que buscás, no dudes en contactarnos.
                </p>
            </div>
            <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-x-8 gap-y-4">
                {faqs.map((faq, i) => (
                    <Card key={i} className="p-4 bg-white">
                        <h3 className="font-semibold">{faq.question}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{faq.answer}</p>
                    </Card>
                ))}
            </div>
        </div>

        {/* CTA */}
        <div className="mt-16 lg:mt-24">
            <div className="bg-orange-500 text-white rounded-lg p-10 text-center flex flex-col items-center">
                <div className="bg-white/20 p-3 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-white"/>
                </div>
                <h2 className="text-3xl font-bold font-headline mb-3">¿Necesitás atención fuera del horario comercial?</h2>
                <p className="max-w-xl mx-auto mb-6 text-orange-100">
                    Para emergencias relacionadas con propiedades en administración o situaciones urgentes, contactanos por WhatsApp. Respondemos las 24 horas.
                </p>
                <Button variant="secondary" size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                    <a href={`https://wa.me/${config?.contactPhone?.replace(/\s|-/g, '')}`} target="_blank"><MessageSquare className="mr-2"/> WhatsApp 24hs</a>
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
}
