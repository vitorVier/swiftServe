import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        table: z
            .number({ message: "A mesa precisa ser um número" })
            .min(1, { message: "A mesa é obrigatória" })
            .int({ message: "A mesa precisa ser um número inteiro" })
            .positive({ message: "A mesa precisa um valor positivo" }),
        name: z.string().optional()
    })
})

export const addItemOrderSchema = z.object({
    body: z.object({
        amount: z
            .number({ message: "A quantidade precisa ser um número" })
            .min(1, { message: "A quantidade é obrigatória" })
            .int({ message: "A quantidade deve ser um número inteiro" })
            .positive({ message: "A quantidade deve ser um valor positivo" }),
        orderId: z.string({ message: "O id da order deve ser uma string" }).min(1, { message: "O id do pedido é obrigatório" }),
        productId: z.string({ message: "O id do produto deve ser uma string" }).min(1, { message: "O id do produto é obrigatório" })
    })
})

export const removeOrderItemSchema = z.object({
    query: z.object({
        itemId: z.string("O id do item deve ser uma string").min(1, { message: "O id do item é obrigatório" })
    })
})

export const detailOrderSchema = z.object({
    query: z.object({
        orderId: z.string("O id do pedido deve ser uma string").min(1, { message: "O id do pedido é obrigatório" })
    })
})

export const sendOrderSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        orderId: z.string("O id do pedido deve ser uma string").min(1, { message: "O id do pedido é obrigatório" })
    })
})

export const finishOrderSchema = z.object({
    body: z.object({
        orderId: z.string("O id do pedido deve ser uma string").min(1, { message: "O id do pedido é obrigatório" })
    })
})

export const deleteOrderSchema = z.object({
    query: z.object({
        orderId: z.string("O id do pedido deve ser uma string").min(1, { message: "O id do pedido é obrigatório" })
    })
})