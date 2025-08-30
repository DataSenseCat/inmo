export type Property = {
    id: string;
    title: string;
    description: string;
    price: number;
    type: 'apartment' | 'house' | 'land';
    operation: 'sale' | 'rent';
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number; // in sq meters
    images: string[];
    isFeatured: boolean;
    contact: {
      name: string;
      phone: string;
      email: string;
    };
  };

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
};
  
  export const properties: Property[] = [
    
  ];

  export const developments: Development[] = [
    
];
  
  export async function getProperties(): Promise<Property[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return properties;
  }
  
  export async function getFeaturedProperties(): Promise<Property[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return properties.filter(p => p.isFeatured);
  }
  
  export async function getPropertyById(id: string): Promise<Property | undefined> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return properties.find(p => p.id === id);
  }
  
  export async function getDevelopments(): Promise<Development[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return developments;
  }
