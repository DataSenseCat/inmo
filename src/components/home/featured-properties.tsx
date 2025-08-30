import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import { getFeaturedProperties } from '@/lib/data';
import { PropertyCard } from '@/components/property-card';
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function FeaturedProperties() {
  const featured = await getFeaturedProperties();

  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
            <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured Properties</h2>
                <p className="text-muted-foreground mt-2">Hand-picked selections from our portfolio.</p>
            </div>
            <Button asChild variant="outline">
                <Link href="/properties">
                    View All <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
            </Button>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featured.map((property) => (
              <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <PropertyCard property={property} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
