import { Request, Response } from "express";
import { DeleteProductService } from "../../services/product/deleteProductService";

export class DeleteProductController {
    async handle(req: Request, res: Response) {
        const productId = req.query?.productId as string;
        const deleteProduct = new DeleteProductService();
        const product = await deleteProduct.execute(productId);
        res.status(200).json(product)
    }
}