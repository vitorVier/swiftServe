"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { SearchIcon, Trash2, User2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { User } from "@/lib/types";
import { ProductForm } from "./productForm";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { useState } from "react";
import { deleteUser } from "@/actions/auth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export function Management({ users }: { users: User[] }) {
    const [sysUsers, setSysUsers] = useState<User[]>([])
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);

        try {
            const result = await deleteUser(userToDelete.id);
            if (result.success) {
                setSysUsers(prev => prev.filter(u => u.id !== userToDelete.id));
                setUserToDelete(null);
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
            {/* Actions: Search & Form */}
            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3">
                <InputGroup className="w-full sm:max-w-72 border-app-border/40 bg-app-card/30 backdrop-blur-sm">
                    <InputGroupInput
                        placeholder="Buscar usuário..."
                        className="bg-transparent text-white placeholder:text-gray-500"
                    // value={searchQuery}
                    // onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <InputGroupAddon className="text-gray-500 bg-transparent border-0">
                        <SearchIcon className="w-4 h-4" />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Table Container */}
            <div className="relative overflow-hidden rounded-2xl border border-app-border/40 bg-app-card/30 backdrop-blur-sm">
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-app-card/50 p-6 rounded-full mb-4">
                            <User2 className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">Nenhum usuário encontrado.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-app-background/50">
                                <TableRow className="border-app-border/40 hover:bg-transparent">
                                    <TableHead className="w-16 text-gray-400 font-semibold uppercase text-[10px] tracking-wider py-3 pl-4">Status</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Nome</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">E-mail</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Role</TableHead>
                                    <TableHead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider text-right pr-4">Ações</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {users.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="group border-app-border/20 hover:bg-white/3 transition-all duration-300"
                                    >
                                        <TableCell className="py-3 pl-4">
                                            <Badge
                                                variant="outline"
                                                className={user.isActive
                                                    ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 font-medium px-2.5 py-0.5 rounded-md"
                                                    : "bg-red-500/5 text-red-500 border-red-500/20 font-medium px-2.5 py-0.5 rounded-md"
                                                }
                                            >
                                                {user.isActive ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-white font-medium">{user.name}</p>
                                        </TableCell>

                                        <TableCell>
                                            <span className="text-gray-400">
                                                {user.email}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={user.role === "ADMIN"
                                                    ? "bg-brand-primary/5 text-brand-primary border-brand-primary/20 font-medium px-2.5 py-0.5 rounded-md"
                                                    : "bg-blue-500/5 text-blue-500 border-blue-500/20 font-medium px-2.5 py-0.5 rounded-md"
                                                }
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right pr-4">
                                            <div className="flex justify-end items-center gap-2 transition-opacity duration-300">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setUserToDelete(user)}
                                                    className="h-10 w-10 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
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
            <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <DialogContent className="sm:max-w-md bg-app-card border-app-border text-white shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight text-white">Confirmar exclusão</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Tem certeza que deseja excluir o usuário <strong className="text-white">{userToDelete?.name}</strong>? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4 border-t border-app-border/40 mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setUserToDelete(null)}
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
    )
}
