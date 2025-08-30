import { Briefcase, Users, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const benefits = [
  {
    icon: Briefcase,
    title: "Years of Experience",
    description: "With over a decade in the local market, we have the expertise to guide you through every step of the process."
  },
  {
    icon: Heart,
    title: "Personalized Attention",
    description: "We treat every client like family, offering tailored advice and support to meet your unique needs."
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "Deeply rooted in Catamarca, we have unparalleled local knowledge and a vast network to benefit you."
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-12 lg:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose Catamarca Estates?</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover the difference of working with a dedicated and experienced team.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center group hover:border-primary transition-colors">
              <CardHeader className="items-center">
                <div className="mx-auto bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <CardTitle className="font-headline">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
