import { prismaClient } from "../../prisma";

export class ListProductByCategoryService {
    async execute(categoryId: string) {
        try {
            // Verifica se a categoria existe
            const categoryExists = await prismaClient.category.findUnique({
                where: { id: categoryId }
            })
            if (!categoryExists) throw new Error("Category not found");

            const products = await prismaClient.product.findMany({
                where: {
                    categoryId: categoryId,
                    disabled: false
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                    disabled: true,
                    categoryId: true,
                    createdAt: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            return products;

        } catch (err) {
            if (err instanceof Error) throw new Error(err.message);
            throw new Error("Error listing products by category");
        }
    }
}