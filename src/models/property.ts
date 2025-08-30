export type Property = {
    id: string;
    title: string;
    description: string;
    priceUSD: number;
    priceARS: number;
    type: 'Casa' | 'Departamento' | 'Local' | 'Lote' | 'Oficina' | 'PH';
    operation: 'Venta' | 'Alquiler';
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: { url: string }[];
    featured: boolean;
    active: boolean;
    agentId: string;
    contact: {
      name: string;
      phone: string;
      email: string;
    };
    features: {
        cochera: boolean;
        piscina: boolean;
        dptoServicio: boolean;
        quincho: boolean;
        parrillero: boolean;
    };
    createdAt: any;
    updatedAt: any;
  };
  

    