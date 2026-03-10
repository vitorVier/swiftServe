import { Request, Response } from "express";
import { CreateUserAdminService } from "../../services/user/createUserAdminService";

export class CreateUserAdminController {
    async handle(req: Request, res: Response) {
        const { name, email, password, role } = req.body;

        const createUserAdminService = new CreateUserAdminService();
        const user = await createUserAdminService.execute({
            name: name,
            email: email,
            password: password,
            role: role
        });

        res.json(user);
    }
}
