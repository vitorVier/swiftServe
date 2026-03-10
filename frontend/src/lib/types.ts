export interface User {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    role: "ADMIN" | "STAFF";
    createdAt: string;
}

export interface AuthResponse {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    token: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    banner: string;
    disabled: boolean;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    category?: {
        id: string;
        name: string;
    }
}

export interface OrderItems {
    id: string;
    amount: number;
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        banner: string;
    }
}

export interface Order {
    id: string;
    table: number;
    name?: string;
    status: boolean; // false = produção | true = finalizado
    draft: boolean; // true = rascunho   | true = enviar para produção
    stage: "pending" | "preparing" | "ready";
    createdAt: string;
    items: OrderItems[];
}