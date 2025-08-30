"use client";

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { properties as allProperties } from '@/lib/data';
import { PropertyCard } from '@/components/property-card';
import { SearchForm } from '@/components/search-form';

export default function PropertiesPage() {
  const searchParams = useSearchParams();

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
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-4xl font-bold font-headline mb-2">Our Properties</h1>
        <p className="text-muted-foreground">Refine your search to find the perfect match.</p>
        <div className="mt-6">
          <SearchForm />
        </div>
      </div>
      
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2 font-headline">No Properties Found</h2>
          <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
        </div>
      )}
    </div>
  );
}
