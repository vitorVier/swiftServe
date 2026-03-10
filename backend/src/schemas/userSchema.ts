import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(3, { message: "O nome precisa ter no minimo 3 letras" }),
        email: z.email({ message: "O email precisa ser válido" }),
        password: z.string().min(6, { message: "A senha precisa ter no minimo 6 caracteres" }),
        role: z.enum(["STAFF", "ADMIN"]).optional(),
    })
})

export const authUserSchema = z.object({
    body: z.object({
        email: z.email({ message: "O email precisa ser válido" }),
        password: z.string().min(6, { message: "A senha precisa ter no mínimo 6 caracteres" })
    })
})

export const createUserAdminSchema = z.object({
    body: z.object({
        name: z.string().min(3, { message: "O nome precisa ter no minimo 3 letras" }),
        email: z.email({ message: "O email precisa ser válido" }),
        password: z.string().min(6, { message: "A senha precisa ter no minimo 6 caracteres" }),
        role: z.enum(["STAFF", "ADMIN"], { message: "Permissão inválida" }),
    })
})

export const updateUserAdminSchema = z.object({
    body: z.object({
        id: z.string(),
        name: z.string().min(3, { message: "O nome precisa ter no minimo 3 letras" }).optional(),
        email: z.email({ message: "O email precisa ser válido" }).optional(),
        password: z.string().min(6, { message: "A senha precisa ter no minimo 6 caracteres" }).optional().or(z.literal('')),
        role: z.enum(["STAFF", "ADMIN"], { message: "Permissão inválida" }).optional(),
    })
})