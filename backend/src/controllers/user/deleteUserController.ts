import { Request, Response } from "express";
import { DeleteUserService } from "../../services/user/deleteUserService";

export class DeleteUserController {
    async handle(req: Request, res: Response) {
        const userId = req.query?.userId as string;
        const deleteProduct = new DeleteUserService();
        const product = await deleteProduct.execute(userId);
        res.status(200).json(product);
    }
}