import { prismaClient } from "../../prisma/index";

export class ListCategoryService {
    async execute() {
        try {
            const categories = await prismaClient.category.findMany({
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                },
                orderBy: { createdAt: "desc" }
            })

            return categories;
        } catch (err) {
            throw new Error("Error listing categories");
        }
    }
}