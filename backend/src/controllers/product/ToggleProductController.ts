import { Request, Response } from "express";
import { ToggleProductService } from "../../services/product/ToggleProductService";

class ToggleProductController {
    async handle(req: Request, res: Response) {
        const product_id = req.query.product_id as string;
        const { disabled } = req.body;

        const toggleProductService = new ToggleProductService();
        const product = await toggleProductService.execute({ product_id, disabled });

        return res.json(product);
    }
}

export { ToggleProductController }
