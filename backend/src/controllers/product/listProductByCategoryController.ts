import { Request, Response } from "express";
import { ListProductByCategoryService } from "../../services/product/listProductByCategoryService";

export class ListProductByCategoryController {
    async handle(req: Request, res: Response) {
        const categoryId = req.query.categoryId as string;
        const listProductByCategory = new ListProductByCategoryService();
        const products = await listProductByCategory.execute(categoryId);
        res.status(200).json(products);
    }
}