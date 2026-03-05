import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayLoad {
    sub: string;
}

export function isAuth(req: Request, res: Response, next: NextFunction) {
    // Verificar se o token foi fornecido
    // O token geralmente é enviado no header "Authorization" no formato Bearer <token>
    const authHeader = req.headers.authorization; // Pega o header de autorização

    if (!authHeader) {
        return res.status(401).json({ message: "Token not provided" })
    }

    const [, token] = authHeader.split(" "); // Divide o header em duas partes: "Bearer" e o token. O token é a segunda parte (index 1)
    
    try {
        const { sub } = verify(token!, process.env.JWT_SECRET! as string) as IPayLoad; // O campo sub é o ID do usuário autenticado | Aqui o token passado é verificado usando a chave JWT da variavel ambiente

        req.userId = sub; // O ID do usuário autenticado é armazenado na requisição para ser usado posteriormente em outros middlewares ou controllers

        return next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}