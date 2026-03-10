"use client"

import { useRouter } from "next/navigation";
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { createUserAdmin } from "@/actions/auth";

export function CreateUserAdmin() {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleCreateUser(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        const formElement = e.currentTarget;

        const name = (formElement.elements.namedItem("name") as HTMLInputElement)?.value;
        const email = (formElement.elements.namedItem("email") as HTMLInputElement)?.value;
        const password = (formElement.elements.namedItem("password") as HTMLInputElement)?.value;

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", selectedRole);

        const result = await createUserAdmin(null, formData);

        setIsLoading(false);

        if (result.success) {
            setOpen(false);
            setSelectedRole("");
            router.refresh();
            return;
        } else {
            console.log(result.error);
            alert(result.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all active:scale-95 font-semibold">
                    <Plus className="w-4 h-4 mr-2 stroke-[3px]" />
                    Novo Usuário
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-app-card border-app-border text-white shadow-2xl">
                {/* Header */}
                <div className="p-6 pb-4 bg-white/5 border-b border-app-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Criar novo usuário</DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm -mt-1.5">
                            Preencha os dados do novo membro da equipe.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="px-6 py-5 space-y-5" onSubmit={handleCreateUser}>
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                            Nome Completo
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Ex: João da Silva..."
                            className="h-11 border-app-border bg-app-background/50 text-white focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="joao@exemplo.com"
                            className="h-11 border-app-border bg-app-background/50 text-white focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                                Senha
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="******"
                                className="py-4 border-app-border bg-app-background/50 text-white focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="role" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                                Permissão (Role)
                            </Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole} required>
                                <SelectTrigger className="border-app-border bg-app-background/50 text-white focus:ring-brand-primary/30">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-app-card border-app-border text-white">
                                    <SelectItem value="STAFF" className="cursor-pointer focus:bg-brand-primary/10 focus:text-white">
                                        Staff
                                    </SelectItem>
                                    <SelectItem value="ADMIN" className="cursor-pointer focus:bg-brand-primary/10 focus:text-white">
                                        Admin
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
                            disabled={isLoading || !selectedRole}
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
