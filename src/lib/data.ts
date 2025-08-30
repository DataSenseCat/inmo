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
    {
      id: '1',
      title: 'Modern Apartment in City Center',
      description: 'A stunning and spacious modern apartment located in the heart of the city. Features floor-to-ceiling windows with breathtaking views, a state-of-the-art kitchen, and access to a rooftop pool and gym. Perfect for urban living.',
      price: 1500,
      type: 'apartment',
      operation: 'rent',
      location: 'Downtown, San Fernando del Valle',
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      images: [
        'https://picsum.photos/seed/prop1-1/800/600',
        'https://picsum.photos/seed/prop1-2/800/600',
        'https://picsum.photos/seed/prop1-3/800/600',
        'https://picsum.photos/seed/prop1-4/800/600',
      ],
      isFeatured: true,
      contact: { name: 'Maria Rodriguez', phone: '+54 383 456 7890', email: 'maria@catamarcaestates.com' },
    },
    {
      id: '2',
      title: 'Charming Family House with Garden',
      description: 'Beautiful family house with a large private garden, perfect for families with children. Includes a cozy fireplace, a spacious patio for barbecues, and a newly renovated kitchen. Located in a quiet and safe neighborhood close to schools.',
      price: 350000,
      type: 'house',
      operation: 'sale',
      location: 'Tres Puentes, San Fernando del Valle',
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      images: [
        'https://picsum.photos/seed/prop2-1/800/600',
        'https://picsum.photos/seed/prop2-2/800/600',
        'https://picsum.photos/seed/prop2-3/800/600',
      ],
      isFeatured: true,
      contact: { name: 'Juan Perez', phone: '+54 383 412 3456', email: 'juan@catamarcaestates.com' },
    },
    {
      id: '3',
      title: 'Vast Land for Development',
      description: 'An exceptional opportunity to acquire a large plot of land in a rapidly developing area. Ideal for building a dream home or for investment purposes. The land offers stunning mountain views and easy access to main roads.',
      price: 120000,
      type: 'land',
      operation: 'sale',
      location: 'El Jumeal, San Fernando del Valle',
      bedrooms: 0,
      bathrooms: 0,
      area: 5000,
      images: [
        'https://picsum.photos/seed/prop3-1/800/600',
      ],
      isFeatured: false,
      contact: { name: 'Carlos Gomez', phone: '+54 383 555 1234', email: 'carlos@catamarcaestates.com' },
    },
    {
        id: '4',
        title: 'Cozy Studio near University',
        description: 'A compact and modern studio apartment, fully furnished and perfect for students or young professionals. Located just a short walk from the National University of Catamarca. Includes all essential amenities and a small balcony.',
        price: 800,
        type: 'apartment',
        operation: 'rent',
        location: 'University District, San Fernando del Valle',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        images: [
          'https://picsum.photos/seed/prop4-1/800/600',
          'https://picsum.photos/seed/prop4-2/800/600',
        ],
        isFeatured: false,
        contact: { name: 'Maria Rodriguez', phone: '+54 383 456 7890', email: 'maria@catamarcaestates.com' },
    },
    {
        id: '5',
        title: 'Luxury Villa with Mountain View',
        description: 'Experience luxury living in this magnificent villa with panoramic views of the Ambato mountains. This property features an infinity pool, a home cinema, a wine cellar, and expansive living spaces designed for entertainment.',
        price: 1200000,
        type: 'house',
        operation: 'sale',
        location: 'La Falda, San Fernando del Valle',
        bedrooms: 5,
        bathrooms: 6,
        area: 600,
        images: [
          'https://picsum.photos/seed/prop5-1/800/600',
          'https://picsum.photos/seed/prop5-2/800/600',
          'https://picsum.photos/seed/prop5-3/800/600',
          'https://picsum.photos/seed/prop5-4/800/600',
          'https://picsum.photos/seed/prop5-5/800/600',
        ],
        isFeatured: true,
        contact: { name: 'Juan Perez', phone: '+54 383 412 3456', email: 'juan@catamarcaestates.com' },
    },
  ];

  export const developments: Development[] = [
    {
        id: 'dev-1',
        title: 'Complejo Residencial Las Palmeras',
        location: 'Av. Siempre Viva 2800, San Fernando del Valle de Catamarca',
        description: 'Moderno complejo residencial con 48 unidades, amenities y espacios verdes, ubicado en la zona con más expansión de Catamarca.',
        status: 'construction',
        isFeatured: true,
        totalUnits: 48,
        availableUnits: 12,
        priceFrom: 85000,
        priceRange: { min: 65000, max: 150000 },
        deliveryDate: 'junio de 2025',
        image: 'https://picsum.photos/seed/dev1/800/600'
    },
    {
        id: 'dev-2',
        title: 'Torres del Valle',
        location: 'República 1100, San Fernando del Valle de Catamarca',
        description: 'Dos torres residenciales de 12 pisos cada una, con vista panorámica a las sierras. Departamentos de 1, 2 y 3 dormitorios.',
        status: 'planning',
        isFeatured: true,
        totalUnits: 120,
        availableUnits: 73,
        priceFrom: 95000,
        priceRange: { min: 80000, max: 180000 },
        deliveryDate: 'diciembre de 2025',
        image: 'https://picsum.photos/seed/dev2/800/600'
    },
    {
        id: 'dev-3',
        title: 'Barrio Cerrado El Mirador',
        location: 'Ruta 38 Km 15, San Fernando del Valle de Catamarca',
        description: 'Exclusivo barrio cerrado con 34 lotes de 600 a 800 m². Seguridad 24hs, club house y espacios recreativos.',
        status: 'finished',
        isFeatured: false,
        totalUnits: 34,
        availableUnits: 5,
        priceFrom: 45000,
        priceRange: { min: 45000, max: 75000 },
        deliveryDate: 'agosto de 2024',
        image: 'https://picsum.photos/seed/dev3/800/600'
    }
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