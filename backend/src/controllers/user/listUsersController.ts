import { Request, Response } from "express";
import { ListUsersService } from "../../services/user/listUsersService";

export class ListUsersController {
    async handle(_: Request, res: Response) {
        const listUsers = new ListUsersService();
        const users = await listUsers.execute();
        return res.status(200).json(users);
    }
}