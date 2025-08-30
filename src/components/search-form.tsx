"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
import { Search } from "lucide-react";

const searchFormSchema = z.object({
  type: z.string().optional(),
  operation: z.string().optional(),
  location: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      type: searchParams.get('type') || '',
      operation: searchParams.get('operation') || '',
      location: searchParams.get('location') || '',
    },
  });

  useEffect(() => {
    try {
        const storedState = localStorage.getItem('searchForm');
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Only reset if there are no URL params, URL params take precedence
            if (!searchParams.toString()) {
                form.reset(parsedState);
            }
        }
    } catch (error) {
        console.error("Failed to parse search form state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
        try {
            localStorage.setItem('searchForm', JSON.stringify(value));
        } catch (error) {
            console.error("Failed to save search form state to localStorage", error);
        }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Sync form with URL search params
  useEffect(() => {
    form.reset({
      type: searchParams.get('type') || '',
      operation: searchParams.get('operation') || '',
      location: searchParams.get('location') || '',
    });
  }, [searchParams, form]);

  function onSubmit(data: SearchFormValues) {
    const params = new URLSearchParams();
    if (data.type) params.append('type', data.type);
    if (data.operation) params.append('operation', data.operation);
    if (data.location) params.append('location', data.location);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 items-end gap-4 p-6 bg-card/80 backdrop-blur-sm rounded-lg shadow-lg">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white md:text-card-foreground">Property Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
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
              <FormLabel className="text-white md:text-card-foreground">Operation</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Rent or Sale" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">Rent or Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white md:text-card-foreground">Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Downtown" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" variant="secondary">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>
    </Form>
  );
}
