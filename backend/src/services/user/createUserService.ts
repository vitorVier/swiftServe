import { prismaClient } from "../../prisma/index";
import { hash } from "bcryptjs";

interface CreateUserProps{
    name: string;
    email: string;
    password: string;
}

export class CreateUserService {
    async execute({ name, email, password }: CreateUserProps) {

        const userAlreadyExist = await prismaClient.user.findFirst({
            where: { email: email }
        })
        if(userAlreadyExist) throw new Error("User already exists");

        const passwordHash = await hash(password, 10);

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })

        return user;
    }
}