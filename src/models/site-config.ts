
export type Service = {
    title: string;
    description: string;
};

export type Certification = {
    name: string;
};

export type SiteConfig = {
    logoUrl?: string;
    contactPhone: string;
    contactEmail: string;
    leadNotificationEmail?: string;
    address: string;
    officeHours: string;
    socials: {
        facebook: string;
        instagram: string;
        twitter: string;
    };
    services?: Service[];
    certifications?: Certification[];
    updatedAt?: any;
};
