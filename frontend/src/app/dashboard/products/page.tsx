import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { ProductsClient } from "@/components/dashboard/productsClient";
import { Package } from "lucide-react";

export default async function Products() {
    const token = await getToken();

    const categories = await apiClient<Category[]>("/categories", {
        token: token!
    });

    const products = await apiClient<Product[]>("/products", {
        token: token!
    });

    return (
        <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex sm:flex-row sm:items-center justify-between pb-4 border-b border-app-border/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Package className="w-6 h-6 mt-0.5 text-brand-primary" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">Produtos</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Gerencie o cardápio da sua unidade com controle total de estoque e categorias.
                    </p>
                </div>
            </div>

            <ProductsClient categories={categories} initialProducts={products} />
        </div>
    );
}