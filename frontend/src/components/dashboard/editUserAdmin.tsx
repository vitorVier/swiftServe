"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Edit2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { updateUserAdmin } from "@/actions/auth";
import { User } from "@/lib/types";
import { toast } from "sonner";

interface EditUserAdminProps {
    user: User;
}

export function EditUserAdmin({ user }: EditUserAdminProps) {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [isLoading, setIsLoading] = useState(false);

    // reset local states when dialog is opened
    useEffect(() => {
        if (open) {
            setSelectedRole(user.role);
        }
    }, [open, user]);

    const router = useRouter();

    async function handleEditUser(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        const formElement = e.currentTarget;

        const name = (formElement.elements.namedItem("name") as HTMLInputElement)?.value;
        const email = (formElement.elements.namedItem("email") as HTMLInputElement)?.value;
        const password = (formElement.elements.namedItem("password") as HTMLInputElement)?.value;

        formData.append("id", user.id);
        if (name) formData.append("name", name);
        if (email) formData.append("email", email);
        if (password) formData.append("password", password);
        if (selectedRole) formData.append("role", selectedRole);

        const result = await updateUserAdmin(null, formData);

        setIsLoading(false);

        if (result.success) {
            setOpen(false);
            router.refresh();
            toast.success('Usuário atualizado com sucesso!');
            return;
        } else {
            toast.error(result.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-gray-400 hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-app-card border-app-border text-white shadow-2xl">
                {/* Header */}
                <div className="p-6 pb-4 bg-white/5 border-b border-app-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Editar usuário</DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm -mt-1.5">
                            Atualize os dados de {user.name}. Caso não queira alterar a senha, deixe o campo de senha em branco.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="px-6 py-5 space-y-5" onSubmit={handleEditUser}>
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                            Nome Completo
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            defaultValue={user.name}
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
                            defaultValue={user.email}
                            placeholder="joao@exemplo.com"
                            className="h-11 border-app-border bg-app-background/50 text-white focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                                Nova Senha
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="******"
                                className="py-4 border-app-border bg-app-background/50 text-white focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="role" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">
                                Permissão (Role)
                            </Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole as any} required>
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
                                    Processando...
                                </div>
                            ) : "Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
