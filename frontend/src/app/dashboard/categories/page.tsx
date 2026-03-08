import { CategoryForm } from "@/components/dashboard/categoryForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";
import { Tags } from "lucide-react";
import Link from "next/link";

export default async function Categories() {
    const token = await getToken();
    const categories = await apiClient<Category[]>("/categories", { token: token! })

    return (
        <div className="space-y-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-app-border/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Tags className="w-6 h-6 mt-0.5 text-brand-primary" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">Categorias</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">Gerencie o catálogo de produtos</p>
                </div>

                <div className="shrink-0 self-center">
                    <CategoryForm />
                </div>
            </div>

            {/* Listagem de Categorias */}
            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-app-border rounded-xl bg-app-card/10">
                    <Tags className="w-8 h-8 text-gray-700 mb-2" />
                    <p className="text-gray-500 text-sm font-medium">Nenhuma categoria encontrada.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {categories.map((category) => (
                        <Link href={`/dashboard/products?category=${category.name}`} key={category.id}>
                            <Card
                                className="group relative bg-app-card border-app-border/60 text-white 
                                transition-all duration-200 hover:border-gray-500/30 
                                hover:bg-app-card/90 active:scale-[0.98]"
                            >
                                {/* Linha de destaque lateral */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gray-400 group-hover:h-1/2 transition-all duration-300" />

                                <CardHeader className="p-4">
                                    <CardTitle className="flex items-center gap-3 text-sm md:text-base font-medium">
                                        <div className="shrink-0 p-1.5 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
                                            <Tags className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="truncate pr-2">{category.name}</span>
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}