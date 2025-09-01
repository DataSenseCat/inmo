import { SearchForm } from '@/components/search-form';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center text-white">
      {/* Background Image and Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/catamarca-estates.appspot.com/o/hero-catamarca.jpg?alt=media"
          alt="Catedral Basílica de Nuestra Señora del Valle, Catamarca"
          data-ai-hint="cathedral catamarca"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 text-center">
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
