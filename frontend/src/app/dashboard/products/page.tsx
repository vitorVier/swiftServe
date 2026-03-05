import { ProductForm } from "@/components/dashboard/productForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { Package, Tags } from "lucide-react";
import Image from "next/image";

export default async function Products() {
    const token = await getToken();

    const categories = await apiClient<Category[]>("/categories", {
        token: token!
    });

    const products = await apiClient<Product[]>("/products", {
        token: token!
    });

    const formatedPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: "currency",
            currency: "BRL"
        }).format(price / 100);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-app-border/40">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Produtos</h1>
                    <p className="text-xs sm:text-sm text-gray-400">Gerencie o catálogo de produtos</p>
                </div>

                <div className="shrink-0 self-center">
                    <ProductForm categories={categories} />
                </div>
            </div>

            {/* Listagem de Categorias */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-app-border rounded-xl bg-app-card/10">
                    <Tags className="w-8 h-8 text-gray-700 mb-2" />
                    <p className="text-gray-500 text-sm font-medium">Nenhum produto encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            className="group overflow-hidden bg-app-card border-app-border/60 text-white
                               transition-all duration-200 hover:border-gray-500/30
                               hover:bg-app-card/90 active:scale-[0.98]"
                        >
                            <div className="relative h-48 w-full">
                                <Image
                                    src={product.banner}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base md:text-lg font-medium">
                                    <Package className="w-5 h-5" />
                                    <span className="truncate pr-2">{product.name}</span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                <p className="text-gray-300 text-sm line-clamp-2">{product.description}</p>

                                <div className="flex items-center justify-between pt-2 border-t border-app-border">
                                    <span className="text-brand-primary font-bold text-lg">
                                        {formatedPrice(product.price)}
                                    </span>

                                    {product.category && (
                                        <span className="text-xs bg-app-background px-2 py-1 rounded-full">
                                            {product.category.name}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}