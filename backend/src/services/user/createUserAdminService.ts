import { prismaClient } from "../../prisma/index";
import { hash } from "bcryptjs";

interface CreateUserAdminProps {
    name: string;
    email: string;
    password: string;
    role: "STAFF" | "ADMIN";
}

export class CreateUserAdminService {
    async execute({ name, email, password, role }: CreateUserAdminProps) {

        const userAlreadyExist = await prismaClient.user.findFirst({
            where: { email: email }
        })
        if (userAlreadyExist) throw new Error("User already exists");

        const passwordHash = await hash(password, 10);

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
                role: role
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                isActive: true
            }
        })

        return user;
    }
}
