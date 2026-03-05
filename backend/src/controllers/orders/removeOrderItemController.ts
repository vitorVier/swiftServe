import { Request, Response } from "express";
import { RemoveOrderItemService } from "../../services/orders/removeOrderItemService";

export class RemoveOrderItemController {
    async handle(req: Request, res: Response) {
        const { itemId } = req.query;
        const removeItem = new RemoveOrderItemService();
        const result = await removeItem.execute(itemId as string);
        res.status(200).json(result)
    }
}