
export type Admin = {
    id: string;
    email: string;
    password: string; // En una app de producción, esto debería ser un hash.
    createdAt?: any;
};
