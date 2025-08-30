
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search } from "lucide-react";

const searchFormSchema = z.object({
  type: z.string().optional(),
  operation: z.string().optional(),
  location: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

function SearchFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      type: searchParams.get('type') || 'any',
      operation: searchParams.get('operation') || 'any',
      location: searchParams.get('location') || '',
    },
  });

  useEffect(() => {
    form.reset({
      type: searchParams.get('type') || 'any',
      operation: searchParams.get('operation') || 'any',
      location: searchParams.get('location') || '',
    });
  }, [searchParams, form]);

  function onSubmit(data: SearchFormValues) {
    const params = new URLSearchParams();
    if (data.type && data.type !== 'any') params.append('type', data.type);
    if (data.operation && data.operation !== 'any') params.append('operation', data.operation);
    if (data.location) params.append('location', data.location);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-4">
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-black font-semibold">Tipo de Propiedad</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Tipo de propiedad" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="any">Todos los tipos</SelectItem>
                        <SelectItem value="apartment">Departamento</SelectItem>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="land">Terreno</SelectItem>
                    </SelectContent>
                    </Select>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-black font-semibold">Operación</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Operación" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="any">Cualquier operación</SelectItem>
                        <SelectItem value="rent">Alquiler</SelectItem>
                        <SelectItem value="sale">Venta</SelectItem>
                    </SelectContent>
                    </Select>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel className="text-black font-semibold">Ubicación</FormLabel>
                    <FormControl>
                    <Input placeholder="Ubicación, barrio, o ciudad" {...field} />
                    </FormControl>
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full md:col-span-4" size="lg">
                <Search className="mr-2 h-5 w-5"/>
                Buscar Propiedades
            </Button>
        </div>
        <div className="text-right mt-2">
            <Link href="#" className="text-sm text-primary hover:underline">
                Búsqueda avanzada
            </Link>
        </div>
      </form>
    </Form>
  );
}


export function SearchForm() {
    return (
        <Suspense fallback={<div>Cargando buscador...</div>}>
            <SearchFormComponent />
        </Suspense>
    )
}
