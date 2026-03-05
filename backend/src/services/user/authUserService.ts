import { compare } from "bcryptjs";
import { prismaClient } from "../../prisma";
import { sign } from "jsonwebtoken";

interface AuthUserServiceProps {
    email: string;
    password: string;
}

export class AuthUserService {
    async execute({ email, password }: AuthUserServiceProps) {
        const userExists = await prismaClient.user.findFirst({
            where: { email: email, }
        })
        if(!userExists) throw new Error("Email e senha incorretos")

        // Compara senha fornecida com a senha armazenada no banco de dados
        const passwordMatch = await compare(password, userExists.password)
        if(!passwordMatch) throw new Error("E-mail ou senha incorretos")

        // Gerar token JWT
        const token = sign({
            name: userExists.name,
            email: userExists.email,
        }, process.env.JWT_SECRET! as string, {
            subject: userExists.id, // O ID do usuário é definido como assunto do token
            expiresIn: "30d" // O token expira em 30 dias
        })

        return { 
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
            role: userExists.role,
            token: token
        }
    }
}