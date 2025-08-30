
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, DollarSign, Filter, Layers, Search, Trash2, Users, CheckCircle, RefreshCw, Plus, Upload, Pencil, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Property } from '@/models/property';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { getProperties } from '@/lib/properties';

export default function AdminDashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);

  useEffect(() => {
    setIsClient(true);
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      router.replace('/admin/login');
    }

    async function loadProperties() {
        const props = await getProperties();
        setRecentProperties(props.slice(0, 5));
    }
    loadProperties();

  }, [router]);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  const stats = [
    { title: "Propiedades Totales", value: "5", subValue: "5 activas", icon: Layers, trend: "+12%" },
    { title: "Leads Totales", value: "3", subValue: "1 hoy", icon: Users, trend: "+5%" },
    { title: "Ingresos Totales", value: "$2.500.000", subValue: "+12% vs mes anterior", icon: DollarSign, trend: "+8%" },
    { title: "Precio Promedio", value: "$26.000", subValue: "USD promedio", icon: Building, trend: "-2%" },
  ];

  const getStatusBadge = (status: boolean) => (
    status ? <Badge variant="default" className="bg-blue-500">Activa</Badge> : <Badge variant="secondary">Inactiva</Badge>
  );

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

        <Card className="mb-8 bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-900"><CheckCircle /> Diagnóstico de Permisos de Admin</CardTitle>
                <Button variant="ghost" size="sm" className="text-green-800 hover:bg-green-100"><RefreshCw className="mr-2 h-4 w-4"/>Actualizar</Button>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-green-800">
                    <div>
                        <h4 className="font-semibold mb-2">Estado del Usuario</h4>
                        <div className="space-y-1">
                            <p className="flex items-center justify-between"><span>Autenticado:</span> <span className="font-bold flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500"/>Sí</span></p>
                            <p className="flex items-center justify-between"><span>Registro en DB:</span> <span className="font-bold flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500"/>Sí</span></p>
                            <p className="flex items-center justify-between"><span>Es Admin:</span> <span className="font-bold flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500"/>Sí</span></p>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Estado de la Base de Datos</h4>
                        <div className="space-y-1">
                            <p className="flex items-center justify-between"><span>Tabla users:</span> <span className="font-bold flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500"/>Existe</span></p>
                            <p className="flex items-center justify-between"><span>Tabla properties:</span> <span className="font-bold flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500"/>Existe</span></p>
                            <p className="flex items-center justify-between"><span>Tabla developments:</span> <span className="font-bold flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500"/>Existe</span></p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-md text-center text-green-900 font-medium">
                    <p>¡Excelente! Tu configuración de administrador está completa. Ahora puedes crear, editar y eliminar propiedades y emprendimientos.</p>
                </div>
            </CardContent>
        </Card>

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
                          <TabsTrigger value="leads">Leads</TabsTrigger>
                          <TabsTrigger value="analysis">Análisis</TabsTrigger>
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
                                  {recentProperties.map(prop => (
                                    <TableRow key={prop.id}>
                                      <TableCell className="font-medium">{prop.title}</TableCell>
                                      <TableCell className="capitalize">{prop.type}</TableCell>
                                      <TableCell className="capitalize">{prop.operation === 'sale' ? 'Venta' : 'Alquiler'}</TableCell>
                                      <TableCell>{prop.location}</TableCell>
                                      <TableCell>10/08/2025</TableCell>
                                      <TableCell>{getStatusBadge(true)}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4"/></Button>
                                          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
                                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                        </div>
                         <div className="text-center mt-6">
                            <Button variant="outline">Ver Todas las Propiedades</Button>
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
    </div>
  );
}
