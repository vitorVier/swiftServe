import { Request, Response } from "express";
import { CreateCategoryService } from "../../services/category/createCategoryService";

export class CreateCategoryController {
    async handle(req: Request, res: Response) {
        const { name } = req.body;

        const createCategory = new CreateCategoryService();
        const category = await createCategory.execute(name);

        res.status(201).json(category);
    }
}