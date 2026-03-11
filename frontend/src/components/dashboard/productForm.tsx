"use client"

import { useRouter } from "next/navigation";
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus, Upload, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Category } from "@/lib/types";
import { createProduct } from "@/actions/products";
import Image from "next/image";
import { toast } from "sonner";

interface ProductFormProps {
    categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [price, setPrice] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null)
    const router = useRouter();

    async function handleCreateProduct(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        if (!imageFile) { setIsLoading(false); alert("Selecione uma imagem"); return };

        const formData = new FormData();
        const formElement = e.currentTarget;

        const name = (formElement.elements.namedItem("product") as HTMLInputElement)?.value;
        const description = (formElement.elements.namedItem("description") as HTMLInputElement)?.value;
        const priceInCents = convertBRLtoCents(price);

        // Adiciona os dados ao FormData - parametros("nome do campo no banco de dados", valor fornecido pelo usuário)
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", priceInCents.toString());
        formData.append("categoryId", selectedCategory);
        formData.append("file", imageFile);

        const result = await createProduct(formData);

        setIsLoading(false);

        if (result.success) {
            setOpen(false);
            setSelectedCategory("");
            router.refresh();
            toast.success('Produto criado com sucesso!');
            return;
        } else {
            toast.error(result.error);
        }
    }

    const formatToBRL = (value: string) => {
        // Remover tudo que não é number
        const numbers = value.replace(/\D/g, "");
        if (!numbers) return "";

        // Converte para número e divide por 100 para ter valor em centavos
        const amount = parseInt(numbers) / 100;
        return amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
    }

    function convertBRLtoCents(value: string): number {
        const cleanValue = value.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", "."); // Remove R$, espaços e substitui vírgula por ponto
        const reais = parseFloat(cleanValue) || 0; // Converte para número e fornece 0 se for inválido
        return Math.round(reais * 100); // Arredonda para centavos
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formattedValue = formatToBRL(e.target.value);
        setPrice(formattedValue);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert("Arquivo muito grande"); return };

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all active:scale-95 font-semibold">
                    <Plus className="w-4 h-4 mr-2 stroke-[3px]" />
                    Novo Produto
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-137.5 p-0 overflow-hidden bg-app-card border-app-border text-white shadow-2xl">
                {/* Header */}
                <div className="p-6 pb-4 bg-white/2 border-b border-app-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Criar novo produto</DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm -mt-1.5">
                            Preencha os detalhes técnicos para adicionar ao estoque.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar" onSubmit={handleCreateProduct}>
                    <div className="space-y-1">
                        <Label htmlFor="product" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                            Nome do produto
                        </Label>
                        <Input
                            id="product"
                            name="product"
                            required
                            placeholder="Ex: Pizza Calabresa Especial..."
                            className="h-11 border-app-border bg-app-background/50 text-white focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="price" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                                Preço (R$)
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                required
                                placeholder="0,00"
                                className="h-11 border-app-border bg-app-background/50 text-white focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary"
                                value={price}
                                onChange={handlePriceChange}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="category" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                                Categoria
                            </Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                                <SelectTrigger className="h-11 border-app-border bg-app-background/50 text-white focus:ring-brand-primary/30">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-app-card border-app-border text-white">
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id} className="cursor-pointer focus:bg-brand-primary/10 focus:text-white">
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                            Descrição Detalhada
                        </Label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Descreva os ingredientes ou detalhes do produto..."
                            className="flex min-h-25 w-full rounded-md border border-app-border bg-app-background/50 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                            Imagem de Exibição
                        </Label>

                        {imagePreview ? (
                            <div className="group relative w-full h-52 border border-app-border rounded-xl overflow-hidden bg-app-background/30">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity duration-200 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                                    <button
                                        type="button"
                                        onClick={() => { setImagePreview(null); setImageFile(null) }}
                                        className="flex flex-col items-center gap-2 p-4 rounded-full transition-transform active:scale-90"
                                    >
                                        <div className="bg-destructive p-4 rounded-full shadow-lg shadow-destructive/40">
                                            <X className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-tighter text-white">
                                            Remover Foto
                                        </span>
                                    </button>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => { setImagePreview(null); setImageFile(null) }}
                                    className="absolute top-2 right-2 h-10 w-10 rounded-full shadow-lg sm:hidden"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        ) : (
                            <label
                                htmlFor="file"
                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-app-border rounded-xl cursor-pointer bg-app-background/20 hover:bg-brand-primary/5 hover:border-brand-primary/40 transition-all group"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-300">
                                        <Upload className="h-6 w-6 text-gray-400 group-hover:text-brand-primary" />
                                    </div>
                                    <p className="mt-3 text-sm text-gray-400">
                                        <span className="font-bold text-gray-300">Clique para subir</span> ou arraste
                                    </p>
                                    <p className="text-[10px] text-gray-500 uppercase mt-1">PNG, JPG (Máx. 5MB)</p>
                                </div>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <div className="pt-4 border-t border-app-border/40 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="flex-1 text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !selectedCategory}
                            className="flex-2 bg-brand-primary text-white hover:bg-brand-primary/90 font-bold shadow-lg shadow-brand-primary/10"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Criando...
                                </div>
                            ) : "Confirmar Cadastro"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}