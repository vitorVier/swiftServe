import { Request, Response } from "express";
import { ListCategoryService } from "../../services/category/listCategoryService";

export class ListCategoryController {
    async handle( _: Request, res: Response ) {
        const listCategory = new ListCategoryService();
        const categories = await listCategory.execute();
        res.status(200).json(categories);
    }
}