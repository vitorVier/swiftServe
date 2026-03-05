import { Request, Response } from "express";
import { SendOrderService } from "../../services/orders/sendOrderService";

export class SendOrderController {
    async handle(req: Request, res: Response) {
        const { name, orderId } = req.body;
        const sendOrder = new SendOrderService();
        const order = await sendOrder.execute({ name, orderId });
        res.status(200).json(order)
    }
}