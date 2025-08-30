
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Briefcase, Check, Handshake, Heart, Home, KeyRound, Landmark, Library, Mail, Phone, Scale, Search, ShieldCheck, Smile, Star, Users, FileText } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';

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

const services = [
    {
      icon: KeyRound,
      title: "Venta de Propiedades",
      description: "Asesoramiento integral para vender tu propiedad al mejor precio y en el menor tiempo posible.",
      items: ["Tasación gratuita", "Marketing digital", "Visitas guiadas", "Tramitación completa"],
    },
    {
      icon: Briefcase,
      title: "Alquiler y Administración",
      description: "Gestión completa de tus propiedades en alquiler para que no te preocupes por nada.",
      items: ["Búsqueda de inquilinos", "Contratos de alquiler", "Administración de cobros", "Mantenimiento"],
    },
    {
      icon: Search,
      title: "Asesoramiento de Inversión",
      description: "Te ayudamos a encontrar las mejores oportunidades de inversión inmobiliaria.",
      items: ["Análisis de mercado", "Proyecciones de rentabilidad", "Zonas en crecimiento", "Financiamiento"],
    },
    {
      icon: Scale,
      title: "Servicios Legales",
      description: "Asesoramiento jurídico especializado para todas tus operaciones inmobiliarias.",
      items: ["Redacción de contratos", "Estudio de títulos", "Regulación de propiedad", "Asesoría legal"],
    },
];

const teamMembers = [
    {
      name: "Roberto Fernández",
      role: "Director / CEO - Corredor Inmobiliario",
      bio: "Más de 20 años de experiencia en el sector inmobiliario. Especialista en grandes desarrollos y ventas corporativas.",
      image: "https://picsum.photos/seed/team1/200/200",
    },
    {
      name: "Maria Rodríguez",
      role: "Gerente Comercial - Corredora Inmobiliaria",
      bio: "Apasionada por las ventas y las relaciones con clientes. Experta en marketing y negociación.",
      image: "https://picsum.photos/seed/team2/200/200",
    },
    {
      name: "Carlos Gómez",
      role: "Tasador Certificado - Ingeniero Civil",
      bio: "Titulado, certificado y con una vasta experiencia en valuar correctamente inmuebles y terrenos.",
      image: "https://picsum.photos/seed/team3/200/200",
    },
    {
      name: "Ana Gonzalez",
      role: "Coordinadora Administrativa",
      bio: "Encargada de que todas las operaciones fluyan correctamente. Contacto clave con escribanías y bancos.",
      image: "https://picsum.photos/seed/team4/200/200",
    },
];

const testimonials = [
    {
      text: "La tasación fue muy profesional y me ayudó a establecer un precio justo para mi casa. ¡Vendimos en menos de un mes!",
      name: "Juan Carlos Paez",
      company: "Cliente Vendedor",
    },
    {
      text: "Muy conformes con el servicio. El informe fue detallado y las recomendaciones me ayudaron mucho en la venta.",
      name: "Laura Martinez",
      company: "Cliente Inversor",
    },
    {
      text: "Profesionalismo, serios y confiables. Me acompañaron en cada paso de la compra de mi primer departamento.",
      name: "Miguel Sanchez",
      company: "Cliente Comprador",
    },
];

const certifications = [
    { name: "Colegio de Martilleros de Catamarca", icon: Landmark },
    { name: "Cámara Inmobiliaria Argentina", icon: Library },
    { name: "Registro Nacional de Administradores", icon: FileText },
    { name: "Certificación ISO 9001", icon: ShieldCheck },
];

export default function AboutUsPage() {
    return (
        <div className="bg-gray-50/50">
            {/* Hero Section */}
            <section className="bg-primary text-primary-foreground py-20">
                <div className="container mx-auto px-4 text-center">
                    <Badge variant="secondary" className="mb-4 bg-white/20 text-white">Desde 2008</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">Inmobiliaria Catamarca</h1>
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
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Nuestros Servicios</h2>
                        <p className="text-muted-foreground mt-2">
                           Ofrecemos una gama completa de servicios inmobiliarios para cubrir todas tus necesidades.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return(
                                <Card key={index} className="p-6 border-l-4 border-primary">
                                    <div className="flex items-start gap-4">
                                        <Icon className="h-8 w-8 text-primary mt-1"/>
                                        <div>
                                            <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                                            <ul className="space-y-2 text-sm">
                                                {service.items.map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-muted-foreground"><Check className="text-green-500 h-4 w-4"/>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                 <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Nuestro Equipo</h2>
                        <p className="text-muted-foreground mt-2">
                            Profesionales capacitados y comprometidos con darte el mejor servicio.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                                <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
                                    <AvatarImage src={member.image} alt={member.name} data-ai-hint="person photo" />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-semibold text-lg">{member.name}</h3>
                                <p className="text-primary text-sm font-medium">{member.role}</p>
                                <p className="text-muted-foreground text-xs mt-3 border-t pt-3">{member.bio}</p>
                            </Card>
                        ))}
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="p-8 bg-gray-50/70 border-l-4 border-primary">
                                <div className="flex mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

             {/* Certifications Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Certificaciones y Membresías</h2>
                        <p className="text-muted-foreground mt-2">
                            Anclados por las principales instituciones del sector inmobiliario.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {certifications.map((cert, index) => {
                            const Icon = cert.icon;
                            return(
                            <Card key={index} className="p-6 flex flex-col items-center justify-center text-center">
                                <Icon className="h-10 w-10 text-primary mb-3"/>
                                <h4 className="font-semibold text-sm text-muted-foreground">{cert.name}</h4>
                            </Card>
                        )})}
                    </div>
                </div>
            </section>

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
                            <a href="tel:+543834901545" className="flex items-center justify-center gap-2 text-sm">
                                <Phone size={14} /> <span>+54 383 490-1545</span>
                            </a>
                            <a href="mailto:info@inmobiliariacatamarca.com" className="flex items-center justify-center gap-2 text-sm">
                                <Mail size={14} /> <span>info@inmobiliariacatamarca.com</span>
                            </a>
                         </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

    