"use server"

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth"
import { revalidatePath } from "next/cache";

export async function finishOrder(orderId: string) {
    if (!orderId) return { success: false, error: "Falha ao finalizar o pedido" }

    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Token não encontrado" }

        const data = { orderId: orderId }
        await apiClient("/order/finish", {
            method: "PUT",
            body: JSON.stringify(data),
            token: token
        })

        revalidatePath("/dashboard");
        return { success: true, error: "" }
    } catch (err) {
        return { success: false, error: "Falha ao finalizar o pedido" }
    }
}

export async function updateOrderStage(orderId: string, stage: "pending" | "preparing" | "ready") {
    if (!orderId || !stage) return { success: false, error: "Dados inválidos" }

    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Token não encontrado" }

        await apiClient("/order/stage", {
            method: "PUT",
            body: JSON.stringify({ orderId, stage }),
            token: token
        })

        // Revalida a página para atualizar os cards imediatamente para outros fluxos (SSR)
        revalidatePath("/dashboard");
        return { success: true, error: "" }
    } catch (err) {
        return { success: false, error: "Falha ao atualizar o estágio do pedido" }
    }
}