import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/authUserService";

export class AuthUserController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body;
        const authService = new AuthUserService();

        const session = await authService.execute({ email, password });

        res.json(session);
    }
}