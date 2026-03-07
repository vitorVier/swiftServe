"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createCategory } from "@/actions/categories";
import { useRouter } from "next/navigation";

export function CategoryForm() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    async function handleCreateCategory(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const result = await createCategory(formData);

        if (result.success) {
            setOpen(false);
            router.refresh();
            return
        } else {
            // toast.error(result.error);
            console.log(result.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all active:scale-95 font-medium">
                    <Plus className="h-4 w-4 mr-2 stroke-[3px]" />
                    Nova Categoria
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25 p-0 overflow-hidden bg-app-card border-app-border text-white shadow-2xl">
                <div className="p-6 pb-4 bg-white/2 border-b border-app-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            Criar nova categoria
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm -pt-1">
                            Preencha os campos abaixo para organizar seu catálogo.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="p-6 space-y-6" onSubmit={handleCreateCategory}>
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1"
                        >
                            Nome da categoria
                        </Label>
                        <Input
                            id="name"
                            name="category"
                            required
                            placeholder="Ex: Bebidas, Sobremesas..."
                            className="h-11 border-app-border bg-app-background/50 text-white 
                                    placeholder:text-gray-600 focus-visible:ring-brand-primary/30 
                                    focus-visible:border-brand-primary transition-all duration-200"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
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
                            className="flex-1 bg-brand-primary text-white hover:bg-brand-primary/90 
                                    font-semibold shadow-md shadow-brand-primary/10 transition-all"
                        >
                            Criar Categoria
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}