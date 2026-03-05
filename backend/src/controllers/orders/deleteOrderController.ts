import { Request, Response } from "express";
import { DeleteOrderService } from "../../services/orders/deleteOrderService";

export class DeleteOrderController {
    async handle(req: Request, res: Response) {
        const orderId = req.query?.orderId as string
        const deleteOrder = new DeleteOrderService()
        const updateOrder = await deleteOrder.execute(orderId)
        return res.json(updateOrder)
    }
}
