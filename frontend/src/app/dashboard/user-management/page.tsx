import { apiClient } from "@/lib/api";
import { getToken, requiredAdmin } from "@/lib/auth";
import { User } from "@/lib/types";
import { User2 } from "lucide-react";
import { Management } from "@/components/dashboard/managements";

export default async function UserManagement() {
    const user = await requiredAdmin();
    const token = await getToken();

    const users = await apiClient<User[]>("/users", {
        token: token!
    });

    return (
        <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex sm:flex-row sm:items-center justify-between pb-4 border-b border-app-border/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <User2 className="w-6 h-6 mt-0.5 text-brand-primary" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">Gerenciamento de usuários</h1>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Gerencie os usuários da sua unidade com controle total.
                    </p>
                </div>
            </div>

            <Management users={users} />
        </div>
    );
}