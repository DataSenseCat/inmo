
'use client';

import { useEffect, useState } from 'react';
import { getPropertyById } from '@/lib/properties';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BedDouble, Bath, AreaChart, MapPin, Phone, Mail, ParkingCircle, Waves, ConciergeBell, Flame, CookingPot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { VirtualTour } from './virtual-tour';
import { Separator } from '@/components/ui/separator';
import type { Property } from '@/models/property';
import { Skeleton } from '@/components/ui/skeleton';

const featureIcons = {
    cochera: ParkingCircle,
    piscina: Waves,
    dptoServicio: ConciergeBell,
    quincho: Flame,
    parrillero: CookingPot,
};

const featureLabels = {
    cochera: "Cochera",
    piscina: "Piscina",
    dptoServicio: "Dpto. de Servicio",
    quincho: "Quincho",
    parrillero: "Parrillero",
};

function PropertyDetailSkeleton() {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="mt-8">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-5 w-1/2" />
                <Separator className="my-6" />
                <Skeleton className="h-6 w-full mb-4" />
                <Separator className="my-6" />
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperty() {
        setLoading(true);
        try {
            const propData = await getPropertyById(params.id);
            if (!propData || !propData.active) {
                notFound();
            }
            setProperty(propData);
        } catch(error) {
            console.error("Failed to load property", error);
            notFound();
        } finally {
            setLoading(false);
        }
    }
    loadProperty();
  }, [params.id]);


  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (!property) {
    return null;
  }

  const isSale = property.operation === 'Venta';
  const price = isSale ? property.priceUSD : property.priceARS;
  const currency = isSale ? 'USD' : 'ARS';
  const availableFeatures = Object.entries(property.features || {}).filter(([_, value]) => value);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
                <Carousel className="w-full group/gallery">
                  <CarouselContent>
                    {property.images.map((img, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[16/10] relative bg-muted">
                          <Image src={img.url} alt={`${property.title} - Image ${index + 1}`} fill className="object-cover" data-ai-hint="property interior" priority={index === 0} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="ml-16 opacity-0 group-hover/gallery:opacity-100 transition-opacity" />
                  <CarouselNext className="mr-16 opacity-0 group-hover/gallery:opacity-100 transition-opacity" />
                </Carousel>
            </Card>
            
            <Card className="mt-8">
                <CardHeader>
                    <Badge variant="outline" className="mb-2 text-sm w-fit">{property.type}</Badge>
                    <CardTitle className="text-3xl md:text-4xl font-bold font-headline">{property.title}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground pt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location}{property.address && `, ${property.address}`}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Separator className='my-4' />
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg my-6">
                        {property.bedrooms > 0 && <span className="flex items-center gap-2"><BedDouble className="w-6 h-6 text-primary" /> {property.bedrooms} Dormitorios</span>}
                        {property.bathrooms > 0 && <span className="flex items-center gap-2"><Bath className="w-6 h-6 text-primary" /> {property.bathrooms} Baños</span>}
                        {property.area > 0 && <span className="flex items-center gap-2"><AreaChart className="w-6 h-6 text-primary" /> {property.area} m²</span>}
                    </div>
                    <Separator className='my-4' />
                    <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Descripción</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{property.description}</p>

                    {availableFeatures.length > 0 && (
                        <>
                            <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Características</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {availableFeatures.map(([key, value]) => {
                                    const Icon = featureIcons[key as keyof typeof featureIcons];
                                    const label = featureLabels[key as keyof typeof featureLabels];
                                    return (
                                        <div key={key} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Icon className="w-5 h-5 text-primary" />
                                            <span>{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-20">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-1">Precio</p>
                <p className="text-4xl font-bold text-primary mb-4">
                  {currency} ${price.toLocaleString()}
                  {!isSale && <span className="text-lg font-normal text-muted-foreground"> / mes</span>}
                </p>
                <Badge variant={isSale ? 'default' : 'secondary'} className='text-sm'>
                  En {property.operation}
                </Badge>
              </CardContent>
              <Separator />
              <CardContent className="p-6">
                    <h3 className="font-semibold text-xl text-center mb-4 font-headline">Tour Virtual IA</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">Explorá esta propiedad desde la comodidad de tu casa con nuestro tour virtual IA.</p>
                    <VirtualTour property={property} />
              </CardContent>
              <Separator />
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl text-center mb-4 font-headline">Contactar Agente</h3>
                <div className="space-y-3">
                    <p className="font-medium text-center">{property.contact.name}</p>
                    <Button variant="outline" asChild className="w-full">
                        <a href={`tel:${property.contact.phone}`} className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4"/>
                            <span>Llamar al Agente</span>
                        </a>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                        <a href={`mailto:${property.contact.email}`} className="flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4"/>
                            <span>Enviar Email al Agente</span>
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
