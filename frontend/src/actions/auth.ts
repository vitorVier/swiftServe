"use server";

import { apiClient } from "@/lib/api";
import { getToken, removeToken, setToken } from "@/lib/auth";
import { AuthResponse, User } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerUser(
    prevState: { success: boolean; error: string, redirectTo?: string } | null,
    formData: FormData
) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string
        const data = { name: name, email: email, password: password }

        await apiClient<User>("/users", { // Salva o usuário no banco de dados
            method: "POST",
            body: JSON.stringify(data)
        });

        return { success: true, error: "", redirectTo: "/login" }
    } catch (err) {
        if (err instanceof Error) return { success: false, error: err.message }
        return { success: false, error: "Erro ao cadastrar usuário" }
    }
}

export async function createUserAdmin(
    prevState: { success: boolean; error: string } | null,
    formData: FormData
) {
    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Não autorizado" };

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as string;
        const data = { name, email, password, role };

        await apiClient<User>("/users/admin", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        revalidatePath("/dashboard/user-management");

        return { success: true, error: "" }
    } catch (err) {
        if (err instanceof Error) return { success: false, error: err.message }
        return { success: false, error: "Erro ao criar usuário" }
    }
}

export async function loginUser(
    prevState: { success: boolean; error: string, redirectTo?: string } | null,
    formData: FormData
) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string
        const data = { email: email, password: password }

        const response = await apiClient<AuthResponse>("/session", {
            method: "POST",
            body: JSON.stringify(data)
        });

        await setToken(response.token); // Salva o token no cookie - 30 dias

        return { success: true, error: "", redirectTo: "/dashboard" }
    } catch (err) {
        if (err instanceof Error) return { success: false, error: err.message || "Erro ao autenticar usuário" }
        return { success: false, error: "Erro ao autenticar usuário" }
    }
}

export async function logOutUser() {
    await removeToken();
    redirect("/login");
}

export async function deleteUser(userId: string) {
    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Token não encontrado" }

        await apiClient<User[]>(`/user?userId=${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        revalidatePath("/dashboard/user-management");

        return { success: true, error: "" };
    } catch (err) {
        if (err instanceof Error) return { success: false, error: err.message }
        return { success: false, error: "Erro ao deletar usuário" };
    }
}