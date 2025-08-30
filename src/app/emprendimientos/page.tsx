
import { DevelopmentCard } from '@/components/emprendimientos/development-card';
import { getDevelopments } from '@/lib/developments';
import type { Development } from '@/models/development';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function EmprendimientosPage() {
  const developments: Development[] = await getDevelopments();

  const filteredDevelopments = (status: 'planning' | 'construction' | 'finished' | null) => {
    if (!status) return developments;
    const filtered = developments.filter(dev => dev.status === status);
    return filtered.length > 0 ? filtered : null;
  };
  
  const renderDevelopments = (devs: Development[] | null) => {
    if (!devs || devs.length === 0) {
      return (
        <div className="col-span-full text-center py-16 border-dashed border-2 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2 font-headline">No se encontraron emprendimientos</h2>
            <p className="text-muted-foreground">No hay emprendimientos en esta categoría por el momento.</p>
        </div>
      )
    }
    return devs.map((dev) => <DevelopmentCard key={dev.id} development={dev} />);
  }

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Emprendimientos Inmobiliarios</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
            Descubrí los mejores desarrollos inmobiliarios en Catamarca. Desde complejos residenciales hasta barrios cerrados, encontrá la inversión perfecta para tu futuro.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-12">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="planning">En Planificación</TabsTrigger>
            <TabsTrigger value="construction">En Construcción</TabsTrigger>
            <TabsTrigger value="finished">Finalizados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderDevelopments(developments)}
            </div>
          </TabsContent>
          <TabsContent value="planning">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderDevelopments(filteredDevelopments('planning'))}
            </div>
          </TabsContent>
          <TabsContent value="construction">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderDevelopments(filteredDevelopments('construction'))}
            </div>
          </TabsContent>
          <TabsContent value="finished">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderDevelopments(filteredDevelopments('finished'))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 py-12 text-center">
            <h2 className="text-3xl font-bold font-headline mb-4">¿Tenés un proyecto inmobiliario?</h2>
            <p className="max-w-2xl mx-auto mb-6">
                Si sos desarrollador o tenés un proyecto inmobiliario, te ayudamos con la comercialización y marketing de tus unidades.
            </p>
            <Button variant="secondary" size="lg" asChild>
                <Link href="/contact">
                    Contactar para Comercialización
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
