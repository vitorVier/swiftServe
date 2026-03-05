import { prismaClient } from "../../prisma";

export class DeleteOrderService {
    async execute(orderId: string) {
        try {
            const order = await prismaClient.order.findFirst({
                where: { id: orderId }
            })
            if (!order) throw new Error("Order not found")

            // Atualiza a propriedade status para false (enviar para cozinha)
            await prismaClient.order.delete({
                where: { id: orderId }
            })

            return { message: "Pedido deletado com sucesso!" }
        } catch (err) {
            console.log(err)
            throw new Error("Failed to delete order")
        }
    }

}