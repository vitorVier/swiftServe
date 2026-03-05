import { Request, Response } from "express";
import { DetailOrderService } from "../../services/orders/detailOrderService";

export class DetailOrderController {
    async handle(req: Request, res: Response) {
        const orderId = req.query.orderId as string;
        const detailOrder = new DetailOrderService();
        const order = await detailOrder.execute(orderId);
        res.status(200).json(order)
    }
}
