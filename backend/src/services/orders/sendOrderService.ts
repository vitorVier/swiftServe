import { prismaClient } from "../../prisma";

interface SendOrderServiceProps {
    name: string;
    orderId: string;
}

export class SendOrderService {
    async execute({ name, orderId }: SendOrderServiceProps) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: orderId,
                    name: name
                }
            })
            if (!order) throw new Error("Order not found")

            // Atualiza a propriedade draft para false (enviar para cozinha)
            const updateOrder = await prismaClient.order.update({
                where: { id: orderId },
                data: {
                    draft: false,
                    name: name
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