import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "O nome do produto é obrigatório" }),
        price: z.string().min(1, { message: "O valor do produto é obrigatório" }).regex(/^\d+$/, { message: "O valor do produto deve ser um número válido" }),
        description: z.string().min(1, { message: "A descrição do produto é obrigatória" }),
        categoryId: z.string().min(1, { message: "A categoria do produto é obrigatória" }),
    })
})

export const listProductSchema = z.object({
    query: z.object({
        disabled: z
            .enum(["true", "false"], { message: "O valor de disabled deve ser 'true' ou 'false'" })
            .optional()
            .default("false")
            .transform((val) => val === "true")
    })
})

export const listProductByCategorySchema = z.object({
    query: z.object({
        categoryId: z.string({ message: "O ID da categoria do produto é obrigatório" })
    })
})