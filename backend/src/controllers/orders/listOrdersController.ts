import { Request, Response } from "express";
import { ListOrdersService } from "../../services/orders/listOrdersService";

export class ListOrdersController {
    async handle(req: Request, res: Response) {
        const draft = req.query?.draft as string | undefined;
        const listOrders = new ListOrdersService();
        const orders = await listOrders.execute(draft);
        return res.json(orders);
    }
}