import { Request, Response } from "express";
import { UpdateStageOrderService } from "../../services/orders/updateStageOrderService";

export class UpdateStageOrderController {
    async handle(req: Request, res: Response) {
        const { orderId, stage } = req.body;

        const updateStageOrderService = new UpdateStageOrderService();
        const order = await updateStageOrderService.execute({ orderId, stage });

        return res.json(order);
    }
}
