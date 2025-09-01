import { SearchForm } from '@/components/search-form';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://picsum.photos/1920/1080"
          alt="Paisaje de Catamarca"
          data-ai-hint="mountain landscape"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <div className="container px-4 md:px-6 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
            Encontrá la propiedad de tus sueños
          </h1>
        </div>
        <div className="max-w-4xl mx-auto mt-8">
            <SearchForm />
        </div>
      </div>
    </section>
  );
}
