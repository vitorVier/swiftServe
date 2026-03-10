import { prismaClient } from "../../prisma/index";
import { hash } from "bcryptjs";

interface UpdateUserAdminProps {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    role?: "STAFF" | "ADMIN";
}

export class UpdateUserAdminService {
    async execute({ id, name, email, password, role }: UpdateUserAdminProps) {

        const user = await prismaClient.user.findFirst({
            where: { id: id }
        })
        if (!user) throw new Error("User not found");

        if (email && email !== user.email) {
            const emailAlreadyExist = await prismaClient.user.findFirst({
                where: { email: email }
            })
            if (emailAlreadyExist) throw new Error("Email already registered by another user");
        }

        const dataToUpdate: any = {};

        if (name) dataToUpdate.name = name;
        if (email) dataToUpdate.email = email;
        if (role) dataToUpdate.role = role;

        if (password) {
            const passwordHash = await hash(password, 10);
            dataToUpdate.password = passwordHash;
        }

        const updatedUser = await prismaClient.user.update({
            where: { id: id },
            data: dataToUpdate,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                isActive: true
            }
        });

        return updatedUser;
    }
}
