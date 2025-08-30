
import { getPropertyById } from '@/lib/properties';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BedDouble, Bath, AreaChart, MapPin, Phone, Mail } from 'lucide-react';
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

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  if (!property) {
    notFound();
  }

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
                    <CardTitle className="text-3xl md:text-4xl font-bold font-headline">{property.title}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground pt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Separator className='my-4' />
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg my-6">
                        <span className="flex items-center gap-2"><BedDouble className="w-6 h-6 text-primary" /> {property.bedrooms} Dormitorios</span>
                        <span className="flex items-center gap-2"><Bath className="w-6 h-6 text-primary" /> {property.bathrooms} Baños</span>
                        <span className="flex items-center gap-2"><AreaChart className="w-6 h-6 text-primary" /> {property.area} m²</span>
                    </div>
                    <Separator className='my-4' />
                    <h2 className="text-2xl font-bold font-headline mt-8 mb-4">Descripción</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{property.description}</p>
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-20">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-1">Precio</p>
                <p className="text-4xl font-bold text-primary mb-4">
                  ${property.priceUSD.toLocaleString()}
                  {property.operation === 'rent' && <span className="text-lg font-normal text-muted-foreground"> / mes</span>}
                </p>
                <Badge variant={property.operation === 'sale' ? 'default' : 'secondary'} className='text-sm'>
                  En {property.operation === 'sale' ? 'Venta' : 'Alquiler'}
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
