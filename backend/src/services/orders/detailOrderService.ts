import { prismaClient } from "../../prisma";

export class DetailOrderService {
    async execute(orderId: string) {
        try {
            // Buscar order com todos os detalhes
            const order = await prismaClient.order.findFirst({
                where: { id: orderId },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    stage: true,
                    createdAt: true,
                    updatedAt: true,
                    items: {
                        select: {
                            id: true,
                            amount: true,
                            createdAt: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    description: true,
                                    banner: true
                                },
                            },
                        },
                    },
                }
            })

            if (!order) throw new Error("Order not found")

            return order

        } catch (err) {
            console.log(err)
            throw new Error("Failed to get order details")
        }
    }
}