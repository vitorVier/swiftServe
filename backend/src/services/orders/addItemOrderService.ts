import { prismaClient } from "../../prisma";

interface ItemProps {
    orderId: string;
    productId: string;
    amount: number;
}

export class AddItemOrderService {
    async execute({ orderId, productId, amount }: ItemProps) {
        try {
            const orderExists = await prismaClient.order.findFirst({
                where: { id: orderId }
            })
            if (!orderExists) throw new Error("Order not found")

            const productExists = await prismaClient.product.findFirst({
                where: { id: productId }
            })
            if (!productExists) throw new Error("Product not found")

            if (productExists.disabled) {
                throw new Error("Produto fora de estoque");
            }

            const item = await prismaClient.orderItem.create({
                data: {
                    orderId: orderId,
                    productId: productId,
                    amount: amount
                },
                select: {
                    id: true,
                    amount: true,
                    orderId: true,
                    productId: true,
                    createdAt: true,
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
            })

            return item;

        } catch (err) {
            if (err instanceof Error) throw err;
            throw new Error("Failed adding item to order");
        }
    }
}