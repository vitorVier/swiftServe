import { ProductForm } from "@/components/dashboard/productForm";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { Trash2, Tags, Image as ImageIcon, Search, SearchIcon } from "lucide-react";
import Image from "next/image";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

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
        <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex sm:flex-row sm:items-center justify-between pb-4 border-b border-app-border/40">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Produtos
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Gerencie o cardápio da sua unidade com controle total de estoque e categorias.
                    </p>
                </div>
            </div>

            <div className="flex w-full items-center justify-end gap-3">
                <InputGroup className="max-w-60">
                    <InputGroupInput placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
                
                <ProductForm categories={categories} />
            </div>

            {/* Container da Tabela com Efeito de Vidro */}
            <div className="relative overflow-hidden rounded-2xl border border-app-border/40 bg-app-card/30 backdrop-blur-sm">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-app-card/50 p-6 rounded-full mb-4">
                            <Tags className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">Sua vitrine está vazia.</p>
                        <p className="text-gray-600 text-sm">Adicione seu primeiro produto para começar a vender.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-app-background/50">
                                <TableRow className="border-app-border/40 hover:bg-transparent">
                                    <TableHead className="w-20 text-gray-400 font-semibold uppercase text-[10px] tracking-wider py-5 pl-7.5">Item</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Informações</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Categoria</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider text-right">Preço</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider text-right pr-6">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow 
                                        key={product.id} 
                                        className="group border-app-border/20 hover:bg-white/3 transition-all duration-300"
                                    >
                                        <TableCell className="py-5 pl-6">
                                            <div className="relative h-20 w-30 rounded-xl overflow-hidden ring-2 ring-app-border/20 group-hover:ring-brand-primary/30 transition-all">
                                                {product.banner ? (
                                                    <Image
                                                        src={product.banner}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-app-background flex items-center justify-center">
                                                        <ImageIcon className="text-gray-700 w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-base group-hover:text-brand-primary transition-colors">
                                                    {product.name}
                                                </span>
                                                <span className="text-xs text-gray-500 line-clamp-1 max-w-75">
                                                    {product.description}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {product.category && (
                                                <Badge 
                                                    variant="outline" 
                                                    className="bg-brand-primary/5 text-brand-primary border-brand-primary/20 font-medium px-2.5 py-0.5 rounded-md"
                                                >
                                                    {product.category.name}
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <span className="text-white font-black text-lg">
                                                {formatedPrice(product.price)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end items-center gap-2 transition-opacity duration-300">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    className="h-10 w-10 text-gray-400 hover:bg-red-500/10 hover:text-brand-primary transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}