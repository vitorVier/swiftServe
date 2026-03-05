import { prismaClient } from "../../prisma";

interface FinishOrderServiceProps {
    orderId: string;
}

export class FinishOrderService {
    async execute({ orderId }: FinishOrderServiceProps) {
        try {
            const order = await prismaClient.order.findFirst({
                where: { id: orderId }
            })
            if (!order) throw new Error("Order not found")

            // Atualiza a propriedade status para false (enviar para cozinha)
            const updateOrder = await prismaClient.order.update({
                where: { id: orderId },
                data: {
                    status: true
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createdAt: true
                }
            })

            return updateOrder
        } catch (err) {
            console.log(err)
            throw new Error("Failed to send order")
        }
    }

}