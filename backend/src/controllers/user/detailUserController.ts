import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/detailUserService";

export class DetailUserController {
    async handle(req: Request, res: Response) {
        const userId = req.userId; // O ID do usuário autenticado é obtido a partir da requisição, que foi definido no middleware isAuth
        const detailUser = new DetailUserService();
        const user = await detailUser.execute(userId);

        return res.json(user);
    }
}