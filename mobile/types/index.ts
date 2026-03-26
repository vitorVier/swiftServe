export interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    createdAt?: string;
}

export interface LoginResponse {
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
    price: string;
    description: string;
    banner: string;
    categoryId: string;
    createdAt: string;
    disabled: boolean;
    category?: Category
}

export interface Order {
    id: string;
    table: number;
    name?: string | null;
    status: boolean;
    draft: boolean;
    userId: string;
    createdAt: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: string;
    amount: number;
    orderId: string;
    productId: string;
    createdAt: string;
    product: Product;
}

export interface CreateOrderRequest {
    table: number;
    name: string;
}

export interface AddItemRequest {
    orderId: string;
    productId: string;
    amount: number;
}

export interface SendOrderRequest {
    orderId: string;
}