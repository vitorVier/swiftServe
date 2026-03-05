import { prismaClient } from "../../prisma/index";

export class CreateCategoryService {
    async execute(name: string) {
        try {
            const category = await prismaClient.category.create({
                data: {
                    name: name
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                }
            })

            return category;
        } catch (err) {
            throw new Error("Error creating category")
        }
    }
}