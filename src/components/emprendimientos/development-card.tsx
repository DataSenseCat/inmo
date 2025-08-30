"use client";

import type { Development } from '@/models/development';
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Home, CheckCircle, Clock } from 'lucide-react';

interface DevelopmentCardProps {
  development: Development;
}

const statusConfig = {
    planning: { label: "En Planificación", icon: Clock, className: "bg-blue-100 text-blue-800 border-blue-200" },
    construction: { label: "En Construcción", icon: Home, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    finished: { label: "Finalizado", icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200" },
};


export function DevelopmentCard({ development }: DevelopmentCardProps) {
  const status = statusConfig[development.status];
  const StatusIcon = status.icon;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-xl h-full flex flex-col group border rounded-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={development.image}
          alt={development.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="building exterior"
        />
        <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="outline" className={`text-xs backdrop-blur-sm bg-white/80 ${status.className}`}>
                <StatusIcon className="w-3 h-3 mr-1.5" />
                {status.label}
            </Badge>
            {development.isFeatured && <Badge variant="secondary" className="bg-primary text-primary-foreground">Destacado</Badge>}
        </div>
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div>
          <h3 className="font-semibold text-xl font-headline mb-2 leading-tight">
            <Link href="#" className="hover:text-primary transition-colors">
                {development.title}
            </Link>
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{development.location}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{development.description}</p>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-muted-foreground border-t pt-5">
            <div className='flex items-start gap-2'>
                <Home className="w-4 h-4 text-primary mt-0.5" />
                <div>
                    <span className='font-medium text-foreground'>{development.totalUnits}</span>
                    <p>Unidades</p>
                </div>
            </div>
            <div className='flex items-start gap-2'>
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                <div>
                    <span className='font-medium text-foreground'>{development.availableUnits}</span>
                    <p>Disponibles</p>
                </div>
            </div>
             <div className='flex items-start gap-2'>
                <p className='text-primary font-bold text-lg mt-0.5'>$</p>
                <div>
                    <span className='font-medium text-foreground'>USD {development.priceFrom.toLocaleString()}</span>
                    <p>Desde</p>
                </div>
            </div>
            <div className='flex items-start gap-2'>
                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                <div>
                    <span className='font-medium text-foreground capitalize'>{development.deliveryDate}</span>
                    <p>Entrega</p>
                </div>
            </div>
          </div>
          
          <div className='mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-center'>
            <p className='text-sm text-blue-900'>
                Rango de precios: <span className='font-semibold'>USD {development.priceRange.min.toLocaleString()} - USD {development.priceRange.max.toLocaleString()}</span>
            </p>
          </div>

        </div>
        <div className="mt-auto pt-6 flex gap-3">
            <Button asChild variant="outline" className='w-full'>
                <Link href="#">
                    Ver Detalles
                </Link>
            </Button>
            <Button asChild className='w-full bg-green-600 hover:bg-green-700'>
                <Link href={`/contact?propertyId=${development.id}`}>
                    Consultar
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
