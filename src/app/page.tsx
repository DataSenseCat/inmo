import { Suspense } from 'react';
import { Hero } from '@/components/home/hero';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { Skeleton } from '@/components/ui/skeleton';

function FeaturedPropertiesSkeleton() {
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

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <FeaturedProperties />
      </Suspense>
      <WhyChooseUs />
    </>
  );
}
