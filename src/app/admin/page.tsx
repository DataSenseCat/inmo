
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, DollarSign, Filter, Layers, Search, Trash2, Users, CheckCircle, RefreshCw, Plus, Upload, Pencil, Eye, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Property } from '@/models/property';
import type { Development } from '@/models/development';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { deleteProperty, getProperties } from '@/lib/properties';
import { deleteDevelopment, getDevelopments } from '@/lib/developments';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [developmentToDelete, setDevelopmentToDelete] = useState<Development | null>(null);

  async function loadData() {
      try {
          setLoading(true);
          const [props, devs] = await Promise.all([getProperties(), getDevelopments()]);
          setProperties(props);
          setDevelopments(devs);
      } catch (error) {
          console.error("Failed to load data:", error);
          toast({
              variant: "destructive",
              title: "Error al cargar datos",
              description: "No se pudieron cargar los datos desde la base de datos.",
          });
      } finally {
          setLoading(false);
      }
  }
  
  useEffect(() => {
    setIsClient(true);
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      router.replace('/admin/login');
    } else {
        loadData();
    }
  }, [router, toast]);

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    try {
      await deleteProperty(propertyToDelete.id);
      toast({
        title: "Propiedad Eliminada",
        description: `La propiedad "${propertyToDelete.title}" ha sido eliminada.`,
      });
      setPropertyToDelete(null);
      loadData(); // Recargar todos los datos
    } catch (error) {
       console.error("Failed to delete property:", error);
       toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: "No se pudo eliminar la propiedad. Inténtalo de nuevo.",
       });
    }
  };

  const handleDeleteDevelopment = async () => {
    if (!developmentToDelete) return;
    try {
      await deleteDevelopment(developmentToDelete.id);
      toast({
        title: "Emprendimiento Eliminado",
        description: `El emprendimiento "${developmentToDelete.title}" ha sido eliminado.`,
      });
      setDevelopmentToDelete(null);
      loadData(); // Recargar todos los datos
    } catch (error) {
       console.error("Failed to delete development:", error);
       toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: "No se pudo eliminar el emprendimiento. Inténtalo de nuevo.",
       });
    }
  };

  if (!isClient) {
    return null; // O un loading spinner
  }

  const stats = [
    { title: "Propiedades Totales", value: properties.length, subValue: `${properties.filter(p => p.active).length} activas`, icon: Layers },
    { title: "Emprendimientos", value: developments.length, subValue: `${developments.filter(d => d.status !== 'finished').length} en curso`, icon: Building },
    { title: "Leads Totales", value: "3", subValue: "1 hoy", icon: Users },
    { title: "Ingresos Totales", value: "$2.500.000", subValue: "+12% vs mes anterior", icon: DollarSign },
  ];

  const getStatusBadge = (status: boolean) => (
    status ? <Badge variant="default" className="bg-blue-500">Activa</Badge> : <Badge variant="secondary">Inactiva</Badge>
  );

  const getDevelopmentStatusBadge = (status: 'planning' | 'construction' | 'finished') => {
    switch (status) {
        case 'planning': return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">En Pozo</Badge>;
        case 'construction': return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">En Construcción</Badge>;
        case 'finished': return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Finalizado</Badge>;
        default: return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold font-headline">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona propiedades, leads y operaciones de la inmobiliaria</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Exportar</Button>
            <Button asChild>
                <Link href="/admin/properties/form">
                    <Plus className="mr-2 h-4 w-4" /> Nueva Propiedad
                </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <Card>
            <CardContent className="p-0">
                <Tabs defaultValue="properties">
                    <div className="px-6 pt-4 border-b">
                      <TabsList>
                          <TabsTrigger value="properties">Propiedades</TabsTrigger>
                          <TabsTrigger value="developments">Emprendimientos</TabsTrigger>
                          <TabsTrigger value="leads">Leads</TabsTrigger>
                          <TabsTrigger value="config">Configuración</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="properties" className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-headline">Propiedades Recientes</h3>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4"/> Filtros</Button>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Buscar..." className="pl-8 h-9" />
                                </div>
                            </div>
                        </div>
                        <div className="border rounded-lg">
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Propiedad</TableHead>
                                      <TableHead>Tipo</TableHead>
                                      <TableHead>Operación</TableHead>
                                      <TableHead>Ubicación</TableHead>
                                      <TableHead>Publicado</TableHead>
                                      <TableHead>Estado</TableHead>
                                      <TableHead className="text-right">Acciones</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">Cargando propiedades...</TableCell>
                                    </TableRow>
                                  ) : properties.length > 0 ? (
                                    properties.map(prop => (
                                    <TableRow key={prop.id}>
                                      <TableCell className="font-medium">{prop.title}</TableCell>
                                      <TableCell className="capitalize">{prop.type}</TableCell>
                                      <TableCell className="capitalize">{prop.operation === 'Venta' ? 'Venta' : 'Alquiler'}</TableCell>
                                      <TableCell>{prop.location}</TableCell>
                                      <TableCell>{prop.createdAt?.toDate().toLocaleDateString() || '-'}</TableCell>
                                      <TableCell>{getStatusBadge(prop.active)}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                          <Button asChild variant="ghost" size="icon">
                                            <Link href={`/properties/${prop.id}`} target="_blank"><Eye className="h-4 w-4"/></Link>
                                          </Button>
                                          <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/properties/form?id=${prop.id}`}><Pencil className="h-4 w-4"/></Link>
                                          </Button>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setPropertyToDelete(prop)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                          </AlertDialogTrigger>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">No hay propiedades creadas.</TableCell>
                                    </TableRow>
                                  )}
                              </TableBody>
                          </Table>
                        </div>
                         <div className="text-center mt-6">
                            <Button variant="outline">Ver Todas las Propiedades</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="developments" className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-headline">Emprendimientos</h3>
                             <Button asChild>
                                <Link href="/admin/developments/form">
                                    <Plus className="mr-2 h-4 w-4" /> Nuevo Emprendimiento
                                </Link>
                            </Button>
                        </div>
                        <div className="border rounded-lg">
                           <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Emprendimiento</TableHead>
                                      <TableHead>Ubicación</TableHead>
                                      <TableHead>Estado</TableHead>
                                      <TableHead>Unidades</TableHead>
                                      <TableHead>Entrega</TableHead>
                                      <TableHead className="text-right">Acciones</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">Cargando emprendimientos...</TableCell>
                                    </TableRow>
                                  ) : developments.length > 0 ? (
                                    developments.map(dev => (
                                    <TableRow key={dev.id}>
                                      <TableCell className="font-medium">{dev.title}</TableCell>
                                      <TableCell>{dev.location}</TableCell>
                                      <TableCell>{getDevelopmentStatusBadge(dev.status)}</TableCell>
                                      <TableCell>{dev.availableUnits} / {dev.totalUnits}</TableCell>
                                      <TableCell>{dev.deliveryDate}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                          <Button asChild variant="ghost" size="icon">
                                            <Link href={`/emprendimientos/${dev.id}`} target="_blank"><Eye className="h-4 w-4"/></Link>
                                          </Button>
                                          <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/developments/form?id=${dev.id}`}><Pencil className="h-4 w-4"/></Link>
                                          </Button>
                                          <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDevelopmentToDelete(dev)}>
                                                  <Trash2 className="h-4 w-4"/>
                                              </Button>
                                          </AlertDialogTrigger>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">No hay emprendimientos creados.</TableCell>
                                    </TableRow>
                                  )}
                              </TableBody>
                           </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="leads" className="p-6 text-center">
                        <h3 className="text-xl font-bold font-headline">Gestión de Leads</h3>
                        <p className="text-muted-foreground">Esta sección está en construcción.</p>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>

       <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>¿Estás seguro de que deseas eliminar esta propiedad?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la propiedad <span className="font-semibold">"{propertyToDelete?.title}"</span> de la base de datos.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProperty} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!developmentToDelete} onOpenChange={(open) => !open && setDevelopmentToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>¿Estás seguro de que deseas eliminar este emprendimiento?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el emprendimiento <span className="font-semibold">"{developmentToDelete?.title}"</span> de la base de datos y su imagen asociada.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDevelopmentToDelete(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDevelopment} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

    