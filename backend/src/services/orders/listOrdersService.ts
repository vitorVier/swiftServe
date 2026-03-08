import { prismaClient } from "../../prisma";

export class ListOrdersService {
    async execute(draft?: string) {
        const orders = await prismaClient.order.findMany({
            where: { draft: draft === "true" ? true : false },
            select: {
                id: true,
                table: true,
                name: true,
                draft: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                items: {
                    select: {
                        id: true,
                        amount: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                description: true,
                                banner: true
                            }
                        }
                    }
                }
            }
        })

        return orders;
    }
}