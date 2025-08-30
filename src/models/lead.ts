
export type Lead = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    contactPreference: "email" | "phone" | "whatsapp";
    subject: string;
    message: string;
    createdAt: any;
};
