import { prismaClient } from "../../prisma";

export class DetailUserService {
    async execute(userId: string) { // O ID do usuário autenticado é passado como argumento para o serviço, que é obtido a partir do middleware de autenticação (isAuth)
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                }
            })        

            if(!user) throw new Error("User not found");

            return user;

        } catch(err) {
            console.error(err);
            throw new Error("Error fetching user details");
        }
    }
}