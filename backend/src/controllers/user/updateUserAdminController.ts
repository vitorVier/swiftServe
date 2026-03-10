import { Request, Response } from "express";
import { UpdateUserAdminService } from "../../services/user/updateUserAdminService";

export class UpdateUserAdminController {
    async handle(req: Request, res: Response) {
        const { id, name, email, password, role } = req.body;

        const updateUserAdminService = new UpdateUserAdminService();
        const user = await updateUserAdminService.execute({
            id: id,
            name: name,
            email: email,
            password: password,
            role: role
        });

        res.status(200).json(user);
    }
}
