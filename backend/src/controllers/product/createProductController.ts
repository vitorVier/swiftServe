import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/createProductService";

export class CreateProductController {
    async handle(req: Request, res: Response) {
        const { name, price, description, categoryId } = req.body;
        if(!req.file) throw new Error("File is required!")

        const createProduct = new CreateProductService();
        const product = await createProduct.execute({
            name: name,
            price: parseInt(price),
            description: description,
            categoryId: categoryId,
            imageBuffer: req.file.buffer,
            imageName: req.file.originalname
        });

        res.json(product)
    }
}