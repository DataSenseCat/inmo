export type Development = {
    id: string;
    title: string;
    location: string;
    description: string;
    status: 'planning' | 'construction' | 'finished';
    isFeatured: boolean;
    totalUnits: number;
    availableUnits: number;
    priceFrom: number;
    priceRange: { min: number; max: number };
    deliveryDate: string;
    image: string;
    createdAt: any;
    updatedAt: any;
  };