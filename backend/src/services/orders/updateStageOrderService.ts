import { prismaClient } from "../../prisma";

interface UpdateStageOrderProps {
    orderId: string;
    stage: string;
}

export class UpdateStageOrderService {
    async execute({ orderId, stage }: UpdateStageOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({
                where: { id: orderId }
            })
            if (!order) throw new Error("Order not found")

            // Atualiza a propriedade stage
            const updateOrder = await prismaClient.order.update({
                where: { id: orderId },
                data: { stage },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    stage: true,
                    createdAt: true
                }
            })

            return updateOrder
        } catch (err) {
            console.log(err)
            throw new Error("Failed to update order stage")
        }
    }
}
