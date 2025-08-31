
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building, DollarSign, Filter, Layers, Search, Trash2, Users, CheckCircle, RefreshCw, Plus, Upload, Pencil, Eye, AlertTriangle, Mail, User, Settings, ExternalLink, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Property } from '@/models/property';
import type { Development } from '@/models/development';
import type { Lead } from '@/models/lead';
import type { Agent } from '@/models/agent';
import type { Testimonial } from '@/models/testimonial';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { deleteProperty, getProperties } from '@/lib/properties';
import { deleteDevelopment, getDevelopments } from '@/lib/developments';
import { getLeads } from '@/lib/leads';
import { getAgents, deleteAgent } from '@/lib/agents';
import { getTestimonials, deleteTestimonial } from '@/lib/testimonials';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { SiteConfig } from '@/models/site-config';
import { getSiteConfig } from '@/lib/config';


function AdminDashboardComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [developmentToDelete, setDevelopmentToDelete] = useState<Development | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [leadToView, setLeadToView] = useState<Lead | null>(null);
  
  const activeTab = searchParams.get('tab') || 'properties';

  async function loadData() {
      try {
          setLoading(true);
          const [props, devs, leadData, agentData, configData, testimonialData] = await Promise.all([
            getProperties(), 
            getDevelopments(),
            getLeads(),
            getAgents(),
            getSiteConfig(),
            getTestimonials(),
          ]);
          setProperties(props);
          setDevelopments(devs);
          setLeads(leadData);
          setAgents(agentData);
          setSiteConfig(configData);
          setTestimonials(testimonialData);
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
      loadData(); 
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
      loadData();
    } catch (error) {
       console.error("Failed to delete development:", error);
       toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: "No se pudo eliminar el emprendimiento. Inténtalo de nuevo.",
       });
    }
  };

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;
    try {
      await deleteAgent(agentToDelete.id);
      toast({
        title: "Agente Eliminado",
        description: `El agente "${agentToDelete.name}" ha sido eliminado.`,
      });
      setAgentToDelete(null);
      loadData();
    } catch (error) {
       console.error("Failed to delete agent:", error);
       toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: "No se pudo eliminar el agente. Inténtalo de nuevo.",
       });
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    try {
      await deleteTestimonial(testimonialToDelete.id);
      toast({
        title: "Testimonio Eliminado",
        description: `El testimonio de "${testimonialToDelete.name}" ha sido eliminado.`,
      });
      setTestimonialToDelete(null);
      loadData();
    } catch (error) {
       console.error("Failed to delete testimonial:", error);
       toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: "No se pudo eliminar el testimonio. Inténtalo de nuevo.",
       });
    }
  };

  const handleTabChange = (value: string) => {
    router.push(`/admin?tab=${value}`);
  };

  if (!isClient) {
    return null; 
  }

  const stats = [
    { title: "Propiedades Totales", value: properties.length, subValue: `${properties.filter(p => p.active).length} activas`, icon: Layers },
    { title: "Emprendimientos", value: developments.length, subValue: `${developments.filter(d => d.status !== 'finished').length} en curso`, icon: Building },
    { title: "Agentes", value: agents.length, subValue: `${agents.filter(a => a.active).length} activos`, icon: User },
    { title: "Leads Totales", value: leads.length, subValue: "Gestiona tus contactos", icon: Users },
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
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <div className="px-6 pt-4 border-b">
                      <TabsList>
                          <TabsTrigger value="properties">Propiedades</TabsTrigger>
                          <TabsTrigger value="developments">Emprendimientos</TabsTrigger>
                          <TabsTrigger value="agents">Agentes</TabsTrigger>
                          <TabsTrigger value="leads">Leads</TabsTrigger>
                          <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
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
                                      <TableCell className="capitalize">{prop.operation}</TableCell>
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
                            <Button asChild variant="outline">
                                <Link href="/properties">Ver Todas las Propiedades</Link>
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="developments" className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-headline">Emprendimientos</h3>
                             <Button asChild>
                                <Link href="/admin/developments/form?tab=developments">
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
                                            <Link href={`/admin/developments/form?id=${dev.id}&tab=developments`}><Pencil className="h-4 w-4"/></Link>
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
                        <div className="text-center mt-6">
                            <Button asChild variant="outline">
                                <Link href="/emprendimientos">Ver Todos los Emprendimientos</Link>
                            </Button>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="agents" className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-headline">Agentes Inmobiliarios</h3>
                             <Button asChild>
                                <Link href="/admin/agents/form?tab=agents">
                                    <Plus className="mr-2 h-4 w-4" /> Nuevo Agente
                                </Link>
                            </Button>
                        </div>
                        <div className="border rounded-lg">
                           <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Agente</TableHead>
                                      <TableHead>Email</TableHead>
                                      <TableHead>Teléfono</TableHead>
                                      <TableHead>Estado</TableHead>
                                      <TableHead className="text-right">Acciones</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">Cargando agentes...</TableCell>
                                    </TableRow>
                                  ) : agents.length > 0 ? (
                                    agents.map(agent => (
                                    <TableRow key={agent.id}>
                                      <TableCell className="font-medium flex items-center gap-3">
                                          <Avatar>
                                              <AvatarImage src={agent.photoUrl} alt={agent.name} />
                                              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          {agent.name}
                                      </TableCell>
                                      <TableCell>{agent.email}</TableCell>
                                      <TableCell>{agent.phone}</TableCell>
                                      <TableCell>{getStatusBadge(agent.active)}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                          <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/agents/form?id=${agent.id}&tab=agents`}><Pencil className="h-4 w-4"/></Link>
                                          </Button>
                                          <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setAgentToDelete(agent)}>
                                                  <Trash2 className="h-4 w-4"/>
                                              </Button>
                                          </AlertDialogTrigger>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">No hay agentes creados.</TableCell>
                                    </TableRow>
                                  )}
                              </TableBody>
                           </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="leads" className="p-6">
                        <h3 className="text-xl font-bold font-headline mb-4">Leads Recibidos</h3>
                        <div className="border rounded-lg">
                           <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Fecha</TableHead>
                                      <TableHead>Nombre</TableHead>
                                      <TableHead>Email</TableHead>
                                      <TableHead>Teléfono</TableHead>
                                      <TableHead>Asunto</TableHead>
                                      <TableHead className="text-right">Acciones</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">Cargando leads...</TableCell>
                                    </TableRow>
                                  ) : leads.length > 0 ? (
                                    leads.map(lead => (
                                    <TableRow key={lead.id}>
                                      <TableCell>{lead.createdAt?.toDate().toLocaleDateString()}</TableCell>
                                      <TableCell className="font-medium">{lead.name}</TableCell>
                                      <TableCell>{lead.email}</TableCell>
                                      <TableCell>{lead.phone || '-'}</TableCell>
                                      <TableCell className="max-w-xs truncate">{lead.subject}</TableCell>
                                      <TableCell className="text-right">
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => setLeadToView(lead)}>
                                                <Eye className="mr-2 h-4 w-4"/> Ver Detalle
                                            </Button>
                                        </AlertDialogTrigger>
                                      </TableCell>
                                    </TableRow>
                                  ))) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">No hay leads recibidos.</TableCell>
                                    </TableRow>
                                  )}
                              </TableBody>
                           </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="testimonials" className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-headline">Testimonios de Clientes</h3>
                             <Button asChild>
                                <Link href="/admin/testimonials/form?tab=testimonials">
                                    <Plus className="mr-2 h-4 w-4" /> Nuevo Testimonio
                                </Link>
                            </Button>
                        </div>
                        <div className="border rounded-lg">
                           <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Cliente</TableHead>
                                      <TableHead>Calificación</TableHead>
                                      <TableHead>Comentario</TableHead>
                                      <TableHead>Estado</TableHead>
                                      <TableHead className="text-right">Acciones</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">Cargando testimonios...</TableCell>
                                    </TableRow>
                                  ) : testimonials.length > 0 ? (
                                    testimonials.map(testimonial => (
                                    <TableRow key={testimonial.id}>
                                      <TableCell className="font-medium">{testimonial.name}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground max-w-sm truncate">{testimonial.comment}</TableCell>
                                      <TableCell>{getStatusBadge(testimonial.active)}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                          <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/testimonials/form?id=${testimonial.id}&tab=testimonials`}><Pencil className="h-4 w-4"/></Link>
                                          </Button>
                                          <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setTestimonialToDelete(testimonial)}>
                                                  <Trash2 className="h-4 w-4"/>
                                              </Button>
                                          </AlertDialogTrigger>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">No hay testimonios creados.</TableCell>
                                    </TableRow>
                                  )}
                              </TableBody>
                           </Table>
                        </div>
                    </TabsContent>

                     <TabsContent value="config" className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-headline">Configuración del Sitio</h3>
                            <Button asChild>
                                <Link href="/admin/config/form?tab=config">
                                    <Pencil className="mr-2 h-4 w-4" /> Editar Configuración
                                </Link>
                            </Button>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Principal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-muted-foreground'>
                                    Estos son los datos que se mostrarán en todo el sitio.
                                </p>
                                {loading ? (
                                    <p className='mt-4'>Cargando configuración...</p>
                                ) : siteConfig ? (
                                    <div className='mt-4 text-sm space-y-2'>
                                        <p><strong>Teléfono:</strong> {siteConfig.contactPhone}</p>
                                        <p><strong>Email:</strong> {siteConfig.contactEmail}</p>
                                        <p><strong>Email de Notificación de Leads:</strong> {siteConfig.leadNotificationEmail || 'No configurado'}</p>
                                        <p><strong>Dirección:</strong> {siteConfig.address}</p>
                                        <p><strong>Horarios:</strong> {siteConfig.officeHours}</p>
                                    </div>
                                ) : (
                                    <p className='mt-4'>No se encontró configuración. Por favor, edítala para añadirla.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>

        <AlertDialog open={!!leadToView} onOpenChange={(open) => !open && setLeadToView(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Detalle del Lead</AlertDialogTitle>
                    <AlertDialogDescription>
                        Recibido el {leadToView?.createdAt?.toDate().toLocaleString()}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {leadToView && (
                    <div className="text-sm space-y-4">
                        <div>
                            <h4 className="font-semibold">Nombre</h4>
                            <p className="text-muted-foreground">{leadToView.name}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Email</h4>
                            <p className="text-muted-foreground">{leadToView.email}</p>
                        </div>
                        {leadToView.phone && (
                            <div>
                                <h4 className="font-semibold">Teléfono</h4>
                                <p className="text-muted-foreground">{leadToView.phone}</p>
                            </div>
                        )}
                        <div>
                            <h4 className="font-semibold">Preferencia de Contacto</h4>
                            <p className="text-muted-foreground capitalize">{leadToView.contactPreference}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Asunto</h4>
                            <p className="text-muted-foreground">{leadToView.subject}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-md border">
                            <h4 className="font-semibold">Mensaje</h4>
                            <p className="text-muted-foreground whitespace-pre-wrap">{leadToView.message}</p>
                        </div>
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setLeadToView(null)}>Cerrar</AlertDialogCancel>
                    {leadToView && (
                        <div className="flex gap-2">
                             <Button asChild variant="secondary">
                                <a href={`https://wa.me/${(leadToView.phone || siteConfig?.contactPhone)?.replace(/\s|-/g, '')}`} target="_blank">
                                    <MessageSquare className="mr-2 h-4 w-4"/> WhatsApp
                                </a>
                            </Button>
                            <Button asChild>
                                <a href={`mailto:${leadToView.email}`}>
                                    <Mail className="mr-2 h-4 w-4"/> Responder Email
                                </a>
                            </Button>
                        </div>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

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

        <AlertDialog open={!!agentToDelete} onOpenChange={(open) => !open && setAgentToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>¿Estás seguro de que deseas eliminar a este agente?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente al agente <span className="font-semibold">"{agentToDelete?.name}"</span> de la base de datos.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setAgentToDelete(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAgent} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!testimonialToDelete} onOpenChange={(open) => !open && setTestimonialToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>¿Estás seguro de que deseas eliminar este testimonio?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el testimonio de <span className="font-semibold">"{testimonialToDelete?.name}"</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setTestimonialToDelete(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteTestimonial} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}


export default function AdminDashboard() {
    return (
        <Suspense fallback={<div>Cargando panel...</div>}>
            <AdminDashboardComponent />
        </Suspense>
    )
}

    