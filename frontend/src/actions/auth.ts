"use server";

import { apiClient } from "@/lib/api";
import { removeToken, setToken } from "@/lib/auth";
import { AuthResponse, User } from "@/lib/types";
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