
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

import {
  FileText,
  Clock,
  ThumbsUp,
  Handshake,
  Eye,
  BarChart2,
  FileSignature,
  Mail,
  MessageCircle,
  Star,
  Award,
  TrendingUp,
  Heart,
  Calendar,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLead } from "@/lib/leads";
import type { SiteConfig } from "@/models/site-config";
import { useEffect, useState } from "react";
import { getSiteConfig } from "@/lib/config";


const tasacionFormSchema = z.object({
  fullName: z.string().min(2, "Nombre y apellido son requeridos."),
  email: z.string().email("Por favor, ingrese un email válido."),
  phone: z.string().optional(),
  propertyAddress: z.string().min(5, "La dirección es requerida."),
  propertyType: z.string().min(1, "Debe seleccionar un tipo de propiedad."),
  area: z.string().optional(),
  comments: z.string().optional(),
});

type TasacionFormValues = z.infer<typeof tasacionFormSchema>;

export default function TasacionesPage() {
    const { toast } = useToast();
    const [config, setConfig] = useState<SiteConfig | null>(null);

    useEffect(() => {
        getSiteConfig().then(setConfig);
    }, []);

    const form = useForm<TasacionFormValues>({
      resolver: zodResolver(tasacionFormSchema),
      defaultValues: {
        fullName: "",
        email: "",
        phone: "",
        propertyAddress: "",
        propertyType: "",
        area: "",
        comments: "",
      },
    });
  
    async function onSubmit(data: TasacionFormValues) {
      try {
        const message = `
          Solicitud de Tasación:
          - Dirección: ${data.propertyAddress}
          - Tipo de Propiedad: ${data.propertyType}
          - Área aprox.: ${data.area || 'No especificada'} m²
          - Comentarios: ${data.comments || 'Ninguno'}
        `;

        await createLead({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          contactPreference: 'email', 
          subject: 'Solicitud de Tasación',
          message: message.trim(),
        });

        toast({
          title: "Solicitud Enviada!",
          description: "Gracias por solicitar una tasación. Nos pondremos en contacto contigo a la brevedad.",
        });
        form.reset();
      } catch (error) {
         console.error('Failed to send valuation request:', error);
         toast({
            variant: 'destructive',
            title: 'Error al enviar',
            description: 'No se pudo enviar tu solicitud. Por favor, intentá de nuevo más tarde.',
         });
      }
    }

  const benefits = [
    {
      icon: Award,
      title: "Más de 15 años de experiencia",
      description: "Nuestro equipo cuenta con una vasta trayectoria en el mercado inmobiliario catamarqueño."
    },
    {
      icon: TrendingUp,
      title: "Análisis de mercado actualizado",
      description: "Utilizamos datos actuales y las últimas tendencias del mercado para brindarte la tasación más precisa."
    },
    {
      icon: Heart,
      title: "Servicio completamente gratuito",
      description: "La tasación no tiene costo alguno, es nuestro compromiso con propietarios de Catamarca."
    },
    {
        icon: Calendar,
        title: "Respuesta en 24 horas",
        description: "Nos contactamos contigo dentro de las 24 horas para coordinar la tasación."
    }
  ];

  const testimonials = [
    {
      name: "Maria Benitez",
      comment: "Excelente servicio. La tasación fue muy profesional y me ayudó a establecer un precio justo para mi casa.",
      rating: 5,
    },
    {
      name: "Carlos Rodriguez",
      comment: "Muy conforme con el servicio. El informe fue detallado y las recomendaciones me ayudaron mucho en la venta.",
      rating: 5,
    },
    {
      name: "Ana Varela",
      comment: "Profesionalismo, serios y confiables. La tasación fue gratuita como prometieron y muy completa.",
      rating: 5,
    },
  ];

  const faqs = [
    {
        question: "¿Realmente es gratuita la tasación?",
        answer: "Sí, completamente gratuita. No cobramos ni por la visita, ni por la evaluación o el informe de tasación. Es nuestro compromiso con los propietarios de Catamarca."
    },
    {
        question: "¿Cuánto tiempo demora el proceso?",
        answer: "El proceso completo demora entre 3 a 5 días hábiles desde la solicitud hasta la entrega del informe final. Nos esforzamos por ser rápidos y eficientes."
    },
    {
        question: "¿Qué incluye el informe de tasación?",
        answer: "El informe incluye un valor estimado, análisis comparativo de mercado, fotos de la propiedad y recomendaciones para mejorar el valor."
    },
    {
        question: "¿Debo estar presente durante la tasación?",
        answer: "Preferentemente sí, para que puedas mostrar las características especiales de tu propiedad y resolver dudas con nuestro tasador."
    },
    {
        question: "¿En qué zonas hacen tasaciones?",
        answer: "Realizamos tasaciones en toda la provincia de Catamarca, priorizando San Fernando del Valle de Catamarca y alrededores."
    },
  ];


  return (
    <div className="bg-gray-50/50">
        {/* Hero Section */}
        <section className="bg-primary text-white py-16">
            <div className="container mx-auto px-4 text-center">
                <Badge className="bg-white/20 text-white mb-4">Servicio gratuito</Badge>
                <h1 className="text-4xl md:text-5xl font-bold font-headline">Tasación Gratuita de tu Propiedad</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-primary-foreground/80">
                    Conocé el valor real de tu propiedad con nuestra tasación profesional y gratuita. Más de 15 años de experiencia en el mercado inmobiliario catamarqueño.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-3 bg-primary-foreground/10 p-4 rounded-lg">
                        <ThumbsUp className="h-7 w-7"/>
                        <div>
                            <p className="font-semibold">100% Gratuito</p>
                            <p className="text-sm text-primary-foreground/70">Sin costos ocultos</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 bg-primary-foreground/10 p-4 rounded-lg">
                        <Clock className="h-7 w-7"/>
                        <div>
                            <p className="font-semibold">Respuesta en 24hs</p>
                            <p className="text-sm text-primary-foreground/70">Contacto inmediato</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 bg-primary-foreground/10 p-4 rounded-lg">
                        <FileText className="h-7 w-7"/>
                        <div>
                            <p className="font-semibold">Informe Completo</p>
                            <p className="text-sm text-primary-foreground/70">Análisis detallado</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      {/* Form and Info Section */}
      <section id="form" className="container mx-auto px-4 md:px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
                <Card className="p-6 sm:p-8">
                <CardHeader className="p-0 mb-6">
                    <CardTitle className="font-headline text-2xl">Solicitar Tasación Gratuita</CardTitle>
                    <p className="text-muted-foreground">Completá el formulario y nos contactaremos contigo en las próximas 24 horas.</p>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre completo *</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Juan Perez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                    <Input placeholder="juan.perez@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                         <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                <Input placeholder="+54 383 123 4567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="propertyAddress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección de la propiedad *</FormLabel>
                                <FormControl>
                                <Input placeholder="Av. Belgrano 1250, Catamarca" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <FormField control={form.control} name="propertyType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de propiedad *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="casa">Casa</SelectItem>
                                            <SelectItem value="departamento">Departamento</SelectItem>
                                            <SelectItem value="terreno">Terreno</SelectItem>
                                            <SelectItem value="local">Local comercial</SelectItem>
                                            <SelectItem value="otro">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="area" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Área aproximada (m²)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="120" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                         <FormField control={form.control} name="comments" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comentarios adicionales</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Detalles adicionales sobre la propiedad..." className="min-h-[100px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">¿Qué incluye la tasación?</h4>
                            <ul className="space-y-1 text-sm list-disc list-inside">
                                <li>Evaluación presencial de la propiedad</li>
                                <li>Análisis comparativo del mercado</li>
                                <li>Informe con valor estimado</li>
                                <li>Recomendaciones para mejorar el valor</li>
                            </ul>
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Enviando..." : "Solicitar Tasación Gratuita"}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">Al enviar este formulario, aceptás que podemos usar tus datos para contactarte. Respetamos tu privacidad.</p>
                    </form>
                    </Form>
                </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">¿Cómo funciona?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Handshake className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <h3 className="font-semibold">1. Contacto Inicial</h3>
                                <p className="text-sm text-muted-foreground">Nos ponés en contacto para coordinar la visita y conocer más detalles de tu propiedad.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Eye className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <h3 className="font-semibold">2. Visita Técnica</h3>
                                <p className="text-sm text-muted-foreground">Nuestro tasador profesional realiza una inspección detallada de la propiedad y su entorno.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <BarChart2 className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <h3 className="font-semibold">3. Análisis de Mercado</h3>
                                <p className="text-sm text-muted-foreground">Analizamos propiedades comparables en la zona y las tendencias actuales del mercado.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <FileSignature className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <h3 className="font-semibold">4. Informe Detallado</h3>
                                <p className="text-sm text-muted-foreground">Recibís un informe completo con el valor estimado y recomendaciones para potenciar el precio.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">¿Preferís contactarnos directamente?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <a href={`https://wa.me/${config?.contactPhone?.replace(/\s|-/g, '')}`} target="_blank" className="flex items-center gap-4 group">
                           <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <MessageCircle className="h-5 w-5 text-green-600"/>
                           </div>
                           <div>
                                <h3 className="font-semibold group-hover:underline">WhatsApp</h3>
                                <p className="text-sm text-muted-foreground">{config?.contactPhone || 'Cargando...'}</p>
                           </div>
                        </a>
                         <a href={`mailto:${config?.contactEmail}`} className="flex items-center gap-4 group">
                           <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Mail className="h-5 w-5 text-blue-600"/>
                           </div>
                           <div>
                                <h3 className="font-semibold group-hover:underline">Email</h3>
                                <p className="text-sm text-muted-foreground">{config?.contactEmail || 'Cargando...'}</p>
                           </div>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">¿Por qué elegir nuestra tasación?</h2>
            <p className="text-muted-foreground mt-2">
              Somos líderes en tasaciones inmobiliarias en Catamarca con un equipo de profesionales certificados.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center p-6 border-t-4 border-primary/50 hover:shadow-lg transition-shadow">
                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{benefit.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
       <section className="py-16 lg:py-24">
         <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Lo que dicen nuestros clientes</h2>
                <p className="text-muted-foreground mt-2">
                Testimonios reales de propietarios que confían en nosotros.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="p-6">
                        <div className="flex items-center mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <p className="text-muted-foreground italic mb-4">"{testimonial.comment}"</p>
                        <p className="font-semibold">{testimonial.name}</p>
                    </Card>
                ))}
            </div>
         </div>
       </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Preguntas Frecuentes</h2>
                <p className="text-muted-foreground mt-2">
                Resolvemos las dudas más comunes sobre nuestro servicio de tasación.
                </p>
            </div>
            <div className="mt-12 max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
      </section>
      
       {/* CTA Section */}
       <section className="bg-green-600 text-white">
        <div className="container mx-auto px-4 md:px-6 py-12 text-center">
            <h2 className="text-3xl font-bold font-headline mb-4">¿Estás pensando en vender tu propiedad?</h2>
            <p className="max-w-2xl mx-auto mb-6 text-green-100">
                Una tasación profesional es el primer paso para una venta exitosa. Conocé el valor real de tu propiedad y vendé al mejor precio.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
                <Button variant="secondary" size="lg" asChild className="bg-white text-green-700 hover:bg-gray-100">
                    <Link href="#form">
                        Solicitar Tasación Gratuita
                    </Link>
                </Button>
                 <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white/10">
                    <Link href="/contact">
                        Contactar Asesor
                    </Link>
                </Button>
            </div>
        </div>
      </section>

    </div>
  );
}
