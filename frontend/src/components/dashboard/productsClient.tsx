"use client";

import { useCallback, useState } from "react";
import { Category, Product } from "@/lib/types";
import { Trash2, Image as ImageIcon, SearchIcon, Package } from "lucide-react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { ProductForm } from "./productForm";
import { toggleProductStatus, deleteProduct } from "@/actions/products";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface ProductsClientProps {
    categories: Category[];
    initialProducts: Product[];
}

export function ProductsClient({ categories, initialProducts }: ProductsClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    // const [activeTab, setActiveTab] = useState("Todos");
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeTab = searchParams.get("category") || "Todos";

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString()); // Pegamos o valor do nome da categoria em formato de string

        if (value === "Todos") {
            params.delete(name); // Limpa a URL se for "Todos"
        } else {
            params.set(name, value); // O '.set' adiciona o par nome=valor (ex: category=Bebidas). Se a chave "category" já existisse, ela seria apenas atualizada.
        }

        return params.toString();
    }, [searchParams]);

    const handleTabChange = (categoryName: string) => {
        const queryString = createQueryString("category", categoryName);
        router.push(`${pathname}?${queryString}`, { scroll: false });
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeTab === "Todos" || product.category?.name === activeTab;
        return matchesSearch && matchesCategory;
    });

    const formatedPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: "currency",
            currency: "BRL"
        }).format(price / 100);
    };

    const handleToggleStatus = async (productId: string, currentDisabled: boolean) => {
        const newDisabled = !currentDisabled;

        // Optimistic UI update
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, disabled: newDisabled } : p));

        try {
            const result = await toggleProductStatus(productId, newDisabled);
            if (!result.success) {
                // Revert on failure
                setProducts(prev => prev.map(p => p.id === productId ? { ...p, disabled: currentDisabled } : p));
                alert("Erro ao alterar o status do produto");
            }
        } catch (error) {
            // Revert on failure
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, disabled: currentDisabled } : p));
            alert("Erro ao alterar o status do produto");
        }
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            const result = await deleteProduct(productToDelete.id);
            if (result.success) {
                setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
                setProductToDelete(null);
            } else {
                alert("Erro ao deletar produto");
            }
        } catch (error) {
            alert("Erro ao deletar produto");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
                <Button
                    variant={activeTab === "Todos" ? "default" : "outline"}
                    className={`rounded-full px-6 transition-all ${activeTab === "Todos" ? 'bg-brand-primary text-white hover:bg-brand-primary/90' : 'bg-transparent text-gray-400 border-app-border hover:text-white hover:border-gray-500 hover:bg-white/5'}`}
                    onClick={() => () => handleTabChange("Todos")}
                >
                    Todos
                </Button>
                {categories.map(category => (
                    <Button
                        key={category.id}
                        variant={activeTab === category.name ? "default" : "outline"}
                        className={`rounded-full px-6 transition-all ${activeTab === category.name ? 'bg-brand-primary text-white hover:bg-brand-primary/90' : 'bg-transparent text-gray-400 border-app-border hover:text-white hover:border-gray-500 hover:bg-white/5'}`}
                        onClick={() => handleTabChange(category.name)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            {/* Actions: Search & Form */}
            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3">
                <InputGroup className="w-full sm:max-w-72 border-app-border/40 bg-app-card/30 backdrop-blur-sm">
                    <InputGroupInput
                        placeholder="Buscar produto..."
                        className="bg-transparent text-white placeholder:text-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <InputGroupAddon className="text-gray-500 bg-transparent border-0">
                        <SearchIcon className="w-4 h-4" />
                    </InputGroupAddon>
                </InputGroup>

                <ProductForm categories={categories} />
            </div>

            {/* Table Container */}
            <div className="relative overflow-hidden rounded-2xl border border-app-border/40 bg-app-card/30 backdrop-blur-sm">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-app-card/50 p-6 rounded-full mb-4">
                            <Package className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">Nenhum produto encontrado.</p>
                        {searchQuery || activeTab !== "Todos" ? (
                            <p className="text-gray-600 text-sm mt-1">Tente ajustar sua busca ou filtro.</p>
                        ) : (
                            <p className="text-gray-600 text-sm mt-1">Adicione seu primeiro produto para começar a vender.</p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-app-background/50">
                                <TableRow className="border-app-border/40 hover:bg-transparent">
                                    <TableHead className="w-16 text-gray-400 font-semibold uppercase text-[10px] tracking-wider py-3 pl-4">Item</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Informações</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Categoria</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider text-right">Preço</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider text-center">Status</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider text-right pr-4">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        className="group border-app-border/20 hover:bg-white/3 transition-all duration-300"
                                    >
                                        <TableCell className="py-3 pl-4">
                                            <div className="relative h-12 w-16 rounded-lg overflow-hidden ring-2 ring-app-border/20 group-hover:ring-brand-primary/30 transition-all">
                                                {product.banner ? (
                                                    <Image
                                                        src={product.banner}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-app-background flex items-center justify-center">
                                                        <ImageIcon className="text-gray-700 w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-sm group-hover:text-brand-primary transition-colors">
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
                                            <span className="text-white font-bold text-base">
                                                {formatedPrice(product.price)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <Switch
                                                checked={!product.disabled}
                                                onCheckedChange={() => handleToggleStatus(product.id, product.disabled)}
                                                className="mx-auto"
                                            />
                                        </TableCell>

                                        <TableCell className="text-right pr-4">
                                            <div className="flex justify-end items-center gap-2 transition-opacity duration-300">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                    onClick={() => setProductToDelete(product)}
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

            {/* Confirmation Dialog */}
            <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
                <DialogContent className="sm:max-w-md bg-app-card border-app-border text-white shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight text-white">Confirmar exclusão</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Tem certeza que deseja excluir o produto <strong className="text-white">{productToDelete?.name}</strong>? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4 border-t border-app-border/40 mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setProductToDelete(null)}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold"
                        >
                            {isDeleting ? "Excluindo..." : "Sim, excluir"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
