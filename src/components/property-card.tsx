import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, AreaChart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Property } from '@/models/property';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-xl h-full flex flex-col group border rounded-lg">
      <Link href={`/properties/${property.id}`} className="block relative aspect-[16/10] overflow-hidden">
        <Image
          src={property.images[0].url}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="property exterior"
        />
        <div className="absolute top-2 left-2 flex gap-2">
            <Badge className="bg-green-600 text-white">
                {property.operation === 'Venta' ? 'Venta' : 'Alquiler'}
            </Badge>
            {property.featured && <Badge variant="secondary">Destacada</Badge>}
        </div>
        <div className="absolute bottom-2 right-2">
            <Badge variant="default" className="text-lg bg-black/70 text-white border-black/70">
                ${property.operation === 'Venta' ? property.priceUSD.toLocaleString() : `${property.priceARS.toLocaleString()}/mes`}
            </Badge>
        </div>
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div>
          <h3 className="font-semibold text-lg font-headline mb-1 leading-tight">
            <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors">
                {property.title}
            </Link>
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{property.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3">
            <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-primary" /> {property.bedrooms}</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-primary" /> {property.bathrooms}</span>
            <span className="flex items-center gap-1.5"><AreaChart className="w-4 h-4 text-primary" /> {property.area} m²</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
             <div className="text-sm">
                <p className="text-muted-foreground">Agente</p>
                <p className="font-semibold">{property.contact.name}</p>
             </div>
             <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link href={`/properties/${property.id}`}>
                        Ver Detalles
                    </Link>
                </Button>
                <Button asChild size="sm">
                    <Link href={`/contact?subject=consulta-venta&propertyId=${property.id}`}>
                        Consultar
                    </Link>
                </Button>
             </div>
          </div>
      </CardContent>
    </Card>
  );
}
