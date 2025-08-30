
import { CheckCircle, Users, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

const benefits = [
  {
    icon: Users,
    title: "Más de 15 años de experiencia",
    description: "Conocemos el mercado inmobiliario catamarqueño como nadie."
  },
  {
    icon: CheckCircle,
    title: "Atención personalizada",
    description: "Te acompañamos en cada paso del proceso de compra o venta."
  },
  {
    icon: Heart,
    title: "Tasaciones gratuitas",
    description: "Conoce el valor real de tu propiedad sin costo alguno."
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-12 lg:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">¿Por qué elegir Inmobiliaria Catamarca?</h2>
                <ul className="space-y-6">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <benefit.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <Button asChild variant="outline" className="mt-8">
                    <Link href="/contact">
                        Conoce Más Sobre Nosotros
                    </Link>
                </Button>
            </div>
            <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                 <Image src="https://picsum.photos/600/600" alt="Imagen de la empresa" width={600} height={600} className="object-cover rounded-lg" data-ai-hint="office building"/>
            </div>
        </div>
      </div>
    </section>
  );
}
