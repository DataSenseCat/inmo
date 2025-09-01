
'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAgents } from "@/lib/agents";
import { getSiteConfig } from "@/lib/config";
import { getTestimonials } from "@/lib/testimonials";
import { Award, Briefcase, Check, Handshake, Heart, Home, KeyRound, Landmark, Library, Mail, Phone, Scale, Search, ShieldCheck, Smile, Star, Users, FileText } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import type { Agent } from '@/models/agent';
import type { SiteConfig } from '@/models/site-config';
import type { Testimonial } from '@/models/testimonial';
import { Skeleton } from '@/components/ui/skeleton';


const stats = [
    { value: "15+", label: "Años de experiencia", icon: Award },
    { value: "2,500+", label: "Propiedades vendidas", icon: Home },
    { value: "5,000+", label: "Clientes satisfechos", icon: Smile },
    { value: "98%", label: "Satisfacción", icon: Star, isFill: true },
];

const missionPoints = [
    "Servicio de alta calidad y profesional",
    "Transparencia en todas las operaciones",
    "Acompañamiento integral",
];

const visionPoints = [
    "Liderazgo en el mercado regional",
    "Innovación tecnológica",
    "Expansión responsable",
];

const serviceIcons: { [key: string]: React.ElementType } = {
  default: Briefcase,
  venta: KeyRound,
  alquiler: Briefcase,
  inversion: Search,
  legal: Scale,
};

const certificationIcons: { [key: string]: React.ElementType } = {
  default: ShieldCheck,
  colegio: Landmark,
  camara: Library,
  registro: FileText,
};

const getIconFor = (name: string, iconMap: { [key: string]: React.ElementType }) => {
    const lowerCaseName = name.toLowerCase();
    for (const key in iconMap) {
        if (lowerCaseName.includes(key)) {
            return iconMap[key];
        }
    }
    return iconMap.default;
};


export default function AboutUsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [agentData, configData, testimonialData] = await Promise.all([
                getAgents(),
                getSiteConfig(),
                getTestimonials(true)
            ]);
            setAgents(agentData);
            setConfig(configData);
            setTestimonials(testimonialData);
            setLoading(false);
        }
        loadData();
    }, []);

    return (
        <div className="bg-gray-50/50">
            {/* Hero Section */}
            <section className="bg-primary text-primary-foreground py-20">
                <div className="container mx-auto px-4 text-center">
                    <Badge variant="secondary" className="mb-4 bg-white/20 text-white">Desde 2008</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">Guerrero Inmobiliaria</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/90">
                        Líderes en el mercado inmobiliario catamarqueño con más de 15 años de experiencia, conectando sueños con realidades a través del mejor servicio profesional.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/contact">Conócenos Ahora</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-white/10">
                            Ver Propiedades
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="bg-primary/10 text-primary p-4 rounded-full mb-3">
                                        <Icon className="h-8 w-8" fill={stat.isFill ? "currentColor" : "none"}/>
                                    </div>
                                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                    <p className="text-muted-foreground">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Mission and Vision Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card className="p-8">
                            <h3 className="flex items-center gap-3 text-2xl font-bold font-headline mb-4"><Heart className="text-primary"/> Nuestra Misión</h3>
                            <p className="text-muted-foreground mb-6">Ser el puente que conecta a las personas con sus sueños inmobiliarios, brindando un servicio integral, profesional y transparente que supere las expectativas de nuestros clientes en cada operación.</p>
                            <ul className="space-y-3">
                                {missionPoints.map((point, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground"><Check className="text-green-500"/>{point}</li>
                                ))}
                            </ul>
                        </Card>
                         <Card className="p-8">
                            <h3 className="flex items-center gap-3 text-2xl font-bold font-headline mb-4"><Handshake className="text-primary"/> Nuestra Visión</h3>
                            <p className="text-muted-foreground mb-6">Ser reconocidos como la inmobiliaria líder en Catamarca, expandiendo nuestros servicios a nivel regional, manteniendo nuestra esencia de cercanía, confianza y excelencia en el servicio.</p>
                            <ul className="space-y-3">
                                {visionPoints.map((point, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground"><Check className="text-green-500"/>{point}</li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

             {/* Services Section */}
             {loading ? <Skeleton className="h-48 w-full" /> : config?.services && config.services.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">Nuestros Servicios</h2>
                            <p className="text-muted-foreground mt-2">
                               Ofrecemos una gama completa de servicios inmobiliarios para cubrir todas tus necesidades.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {config.services.map((service, index) => {
                                const Icon = getIconFor(service.title, serviceIcons);
                                return(
                                    <Card key={index} className="p-6 border-l-4 border-primary">
                                        <div className="flex items-start gap-4">
                                            <Icon className="h-8 w-8 text-primary mt-1"/>
                                            <div>
                                                <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                                                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </section>
             )}

            {/* Team Section */}
            <section className="py-20">
                 <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Nuestro Equipo</h2>
                        <p className="text-muted-foreground mt-2">
                            Profesionales capacitados y comprometidos con darte el mejor servicio.
                        </p>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                             {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-64 w-full" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {agents.map((agent) => (
                                <Card key={agent.id} className="text-center p-6 hover:shadow-lg transition-shadow">
                                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                                        <AvatarImage src={agent.photoUrl} alt={agent.name} data-ai-hint="person photo" />
                                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                                    <p className="text-primary text-sm font-medium">Agente Inmobiliario</p>
                                    {agent.bio && <p className="text-muted-foreground text-xs mt-3 border-t pt-3">{agent.bio}</p>}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Lo que dicen nuestros clientes</h2>
                        <p className="text-muted-foreground mt-2">
                            Testimonios reales de personas que confían en nosotros.
                        </p>
                    </div>
                    {loading ? (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[...Array(3)].map((_,i) => <Skeleton key={i} className="h-48 w-full" />)}
                        </div>
                    ) : testimonials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial) => (
                                <Card key={testimonial.id} className="p-8 bg-gray-50/70 border-l-4 border-primary">
                                    <div className="flex mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground italic mb-4">"{testimonial.comment}"</p>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">Cliente Satisfecho</p>
                                </Card>
                            ))}
                        </div>
                     ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <p>Aún no hay testimonios para mostrar. ¡Vuelve pronto!</p>
                        </div>
                     )}
                </div>
            </section>

             {/* Certifications Section */}
            {loading ? <Skeleton className="h-32 w-full" /> : config?.certifications && config.certifications.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">Certificaciones y Membresías</h2>
                            <p className="text-muted-foreground mt-2">
                                Anclados por las principales instituciones del sector inmobiliario.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {config.certifications.map((cert, index) => {
                                const Icon = getIconFor(cert.name, certificationIcons);
                                return(
                                <Card key={index} className="p-6 flex flex-col items-center justify-center text-center">
                                    <Icon className="h-10 w-10 text-primary mb-3"/>
                                    <h4 className="font-semibold text-sm text-muted-foreground">{cert.name}</h4>
                                </Card>
                            )})}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-10 text-center">
                         <h2 className="text-3xl font-bold font-headline mb-3">¿Listo para tu próxima operación inmobiliaria?</h2>
                         <p className="max-w-2xl mx-auto mb-6 text-primary-foreground/80">
                            Nuestro equipo está preparado para ayudarte a alcanzar tus objetivos inmobiliarios. Contactanos hoy mismo y descubrí la diferencia de trabajar con profesionales.
                         </p>
                         <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Button asChild size="lg" variant="secondary">
                                <Link href="/contact">
                                    <Mail className="mr-2"/> Contactar Ahora
                                </Link>
                            </Button>
                            <a href={`tel:${config?.contactPhone}`} className="flex items-center justify-center gap-2 text-sm">
                                <Phone size={14} /> <span>{config?.contactPhone}</span>
                            </a>
                            <a href={`mailto:${config?.contactEmail}`} className="flex items-center justify-center gap-2 text-sm">
                                <Mail size={14} /> <span>{config?.contactEmail}</span>
                            </a>
                         </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
