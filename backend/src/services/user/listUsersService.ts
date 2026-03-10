import { prismaClient } from "../../prisma";

export class ListUsersService {
    async execute() {
        try {
            const users = await prismaClient.user.findMany({
                select: {
                    id: true,
                    isActive: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
            return users;
        } catch (err) {
            throw new Error("Error fetching users.")
        }
    }
}