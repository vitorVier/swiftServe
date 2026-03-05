import { prismaClient } from "../../prisma";

export class RemoveOrderItemService {
    async execute(itemId: string) {
        try {
            const itemExists = await prismaClient.orderItem.findFirst({
                where: { id: itemId }
            })
            if (!itemExists) throw new Error("Item not found")

            await prismaClient.orderItem.delete({
                where: { id: itemId }
            })

            return { message: "Item removed successfully" }

        } catch (err) {
            console.log(err)
            throw new Error("Failed to remove product");
        }
    }
}