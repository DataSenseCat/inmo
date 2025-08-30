
"use client";

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense, useState, useEffect } from 'react';
import type { Property } from '@/models/property';
import { getProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/property-card';
import { SearchForm } from '@/components/search-form';
import { Skeleton } from '@/components/ui/skeleton';

function PropertiesList() {
  const searchParams = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      const props = await getProperties();
      setAllProperties(props.filter(p => p.active)); // Solo mostrar propiedades activas
      setLoading(false);
    }
    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    const type = searchParams.get('type');
    const operation = searchParams.get('operation');
    const location = searchParams.get('location')?.toLowerCase();

    return allProperties.filter(property => {
      if (type && type !== 'any' && property.type !== type) return false;
      if (operation && operation !== 'any' && property.operation !== operation) return false;
      if (location && !property.location.toLowerCase().includes(location)) return false;
      return true;
    });
  }, [searchParams, allProperties]);

  if (loading) {
    return <PropertiesSkeleton />;
  }

  return (
    <>
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg col-span-full">
          <h2 className="text-2xl font-semibold mb-2 font-headline">No se encontraron propiedades</h2>
          <p className="text-muted-foreground">Intentá ajustar los filtros de búsqueda o volvé a mirar más tarde.</p>
        </div>
      )}
    </>
  );
}

function PropertiesPageContent() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-4xl font-bold font-headline mb-2">Nuestras Propiedades</h1>
        <p className="text-muted-foreground">Refiná tu búsqueda para encontrar la propiedad perfecta.</p>
        <div className="mt-6">
          <SearchForm />
        </div>
      </div>
      <PropertiesList />
    </div>
  );
}

function PropertiesSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <Skeleton className="h-[240px] w-full" />
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                        <div className="flex justify-between items-center pt-2">
                           <Skeleton className="h-8 w-1/4" />
                           <Skeleton className="h-8 w-1/4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={<div>Cargando página...</div>}>
            <PropertiesPageContent />
        </Suspense>
    )
}
