"use server"

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Erro ao criar categoria" }

        const name = formData.get("category") as string;
        if (!name) return { success: false, error: "Nome da categoria é obrigatório" }

        await apiClient<Category>("/categories", {
            method: "POST",
            body: JSON.stringify({ name }),
            token: token
        })

        revalidatePath("/dashboard/categories");

        return { success: true, error: "" }
    } catch (err) {
        if (err instanceof Error) { return { success: false, error: err.message } }
        return { success: false, error: "Erro ao criar categoria" }
    }
}