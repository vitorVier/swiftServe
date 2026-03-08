"use server"

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth"
import { revalidatePath } from "next/cache";

export async function finishOrder(orderId: string) {
    if (!orderId) return { success: false, error: "Falha ao finalizar o pedido" }

    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Falha ao finalizar o pedido" }

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