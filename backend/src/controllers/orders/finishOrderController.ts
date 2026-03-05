import { Request, Response } from "express";
import { FinishOrderService } from "../../services/orders/finishOrderService";

export class FinishOrderController {
    async handle(req: Request, res: Response) {
        const { orderId } = req.body;
        const finishOrder = new FinishOrderService();
        const updateOrder = await finishOrder.execute({ orderId });
        res.status(200).json(updateOrder)
    }
}