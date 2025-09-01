
'use client';

import { useEffect, useState } from 'react';
import { getDevelopmentById } from '@/lib/developments';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Calendar, Building, CheckCircle, Clock, Home, DollarSign, MessageCircle, Mail, Phone, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/config';
import type { Development } from '@/models/development';
import type { SiteConfig } from '@/models/site-config';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig = {
    planning: { label: "En Planificación", icon: Clock, className: "bg-blue-100 text-blue-800 border-blue-200" },
    construction: { label: "En Construcción", icon: Building, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    finished: { label: "Finalizado", icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200" },
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
        <Icon className="w-8 h-8 text-primary" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold text-lg">{value}</p>
        </div>
    </div>
);

function DevelopmentDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12">
            <div className="mb-8">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2 mt-2" />
            </div>
            <div className="grid lg:grid-cols-5 gap-8 xl:gap-12">
                <div className="lg:col-span-3">
                    <Skeleton className="aspect-[16/10] w-full mb-8" />
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function DevelopmentDetailPage({ params }: { params: { id: string } }) {
  const [development, setDevelopment] = useState<Development | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        setLoading(true);
        const [devData, configData] = await Promise.all([
            getDevelopmentById(params.id),
            getSiteConfig()
        ]);
        
        if (!devData) {
            notFound();
            return;
        }

        setDevelopment(devData);
        setConfig(configData);
        setLoading(false);
    }
    loadData();
  }, [params.id]);


  if (loading) {
    return <DevelopmentDetailSkeleton />;
  }

  if (!development) {
    return null; // or notFound(), but loading handles this.
  }

  const status = statusConfig[development.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12">
        
        {/* Header */}
        <div className="mb-8">
            <Badge variant="outline" className={`mb-2 text-sm ${status.className}`}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {status.label}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">{development.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2 text-lg">
                <MapPin className="w-5 h-5" />
                <span>{development.location}</span>
            </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 xl:gap-12">
          {/* Content Column */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden mb-8">
                <div className="aspect-[16/10] relative bg-muted">
                  <Image src={development.image} alt={development.title} fill className="object-cover" data-ai-hint="building exterior" priority />
                </div>
            </Card>

            <h2 className="text-3xl font-bold font-headline mb-4">Sobre el Emprendimiento</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{development.description}</p>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline">Detalles Clave</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                 <DetailItem icon={Calendar} label="Entrega Estimada" value={development.deliveryDate} />
                 <DetailItem icon={Home} label="Unidades Totales" value={development.totalUnits} />
                 <DetailItem icon={CheckCircle} label="Unidades Disponibles" value={development.availableUnits} />
                 {development.priceFrom && <DetailItem icon={DollarSign} label="Precios Desde" value={`USD ${development.priceFrom.toLocaleString()}`} />}
                 {development.priceRange?.min && development.priceRange?.max && (
                    <div className="sm:col-span-2 lg:col-span-1 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                        <p className="text-sm text-primary/80">Rango de Precios</p>
                        <p className="font-semibold text-lg text-primary">USD {development.priceRange.min.toLocaleString()} - {development.priceRange.max.toLocaleString()}</p>
                    </div>
                 )}
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Building2 className='w-6 h-6'/>¿Interesado en este desarrollo?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm">Contactá a nuestros asesores especializados para recibir más información, planos y coordinar una visita.</p>
                    <Button asChild className="w-full" size="lg">
                      <Link href={`/contact?subject=consulta-emprendimiento&developmentId=${development.id}`}>
                        <MessageCircle className="mr-2"/> Solicitar Información
                      </Link>
                    </Button>
                     <div className='flex gap-2 justify-center pt-2'>
                        <Button variant="outline" asChild size="sm">
                            <a href={`mailto:${config?.contactEmail}`}>
                                <Mail className="mr-2"/> Email
                            </a>
                        </Button>
                         <Button variant="outline" asChild size="sm">
                            <a href={`tel:${config?.contactPhone}`}>
                                <Phone className="mr-2"/> Llamar
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
