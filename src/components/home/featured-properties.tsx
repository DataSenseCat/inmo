
'use client';

import { useEffect, useState } from 'react';
import { getFeaturedProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/property-card';
import { Button } from "../ui/button";
import Link from "next/link";
import { Skeleton } from '../ui/skeleton';
import type { Property } from '@/models/property';

export function FeaturedProperties() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
        setLoading(true);
        try {
            const props = await getFeaturedProperties();
            setFeatured(props);
        } catch (error) {
            console.error("Error getting featured properties (the app will proceed with an empty list): ", error);
        } finally {
            setLoading(false);
        }
    }
    loadFeatured();
  }, []);

  if (loading) {
      return (
        <section className="py-12 lg:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <Skeleton className="h-[200px] w-full" />
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-8 w-full mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )
  }

  if (featured.length === 0) {
    return (
        <section className="py-12 lg:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Propiedades Destacadas</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Actualmente no hay propiedades destacadas. ¡Vuelve pronto!</p>
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
