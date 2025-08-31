
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import { getFeaturedProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/property-card';
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function FeaturedProperties() {
  const featured = await getFeaturedProperties();

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Propiedades Destacadas</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Descubra nuestra selección de propiedades destacadas en las mejores ubicaciones de Catamarca.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/properties">
                    Ver Todas las Propiedades
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
