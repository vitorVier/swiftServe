import { Request, Response } from "express";
import { AddItemOrderService } from "../../services/orders/addItemOrderService";

export class AddItemOrderController {
    async handle(req: Request, res: Response) {
        const { orderId, productId, amount } = req.body;
        const addItemOrder = new AddItemOrderService();
        const newItem = await addItemOrder.execute({
            orderId: orderId,
            productId: productId,
            amount: amount
        });
        return res.status(201).json(newItem);
    }
}