import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, AreaChart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Property } from '@/lib/data';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-xl h-full flex flex-col group">
      <CardContent className="p-0 flex flex-col flex-grow">
        <Link href={`/properties/${property.id}`} className="block relative aspect-[16/10] overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="property exterior"
          />
          <Badge className="absolute top-3 right-3" variant={property.operation === 'sale' ? 'default' : 'secondary'}>
            For {property.operation === 'sale' ? 'Sale' : 'Rent'}
          </Badge>
        </Link>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg font-headline mb-1 leading-tight">
            <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors">
                {property.title}
            </Link>
          </h3>
          <p className="text-muted-foreground text-sm mb-3">{property.location}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-accent" /> {property.bedrooms} beds</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-accent" /> {property.bathrooms} baths</span>
            <span className="flex items-center gap-1.5"><AreaChart className="w-4 h-4 text-accent" /> {property.area} m²</span>
          </div>
          
          <div className="mt-auto flex justify-between items-center">
             <p className="text-xl font-bold text-primary">
               ${property.price.toLocaleString()}
               {property.operation === 'rent' && <span className="text-sm font-normal text-muted-foreground"> / month</span>}
             </p>
             <Button asChild variant="ghost" size="sm" className="text-accent-foreground/80 hover:text-primary">
                <Link href={`/properties/${property.id}`}>
                  View <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
