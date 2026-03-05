"use server"
import { getToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Token não encontrado" }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erro ao criar produto");
        }

        await response.json();
        revalidatePath("/dashboard/products");

        return { success: true, error: "" };
    } catch (err) {
        if (err instanceof Error) return { success: false, error: err.message }
        return { success: false, error: "Erro ao criar produto" };
    }
}