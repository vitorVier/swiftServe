import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../prisma/index";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId; 
    if(!userId) return res.status(401).json({ error: "Unauthorized" })

    const user = await prismaClient.user.findFirst({
        where: { id: userId }
    })
    if(!user || user.role !== "ADMIN") return res.status(401).json({ error: "Unauthorized" })
    
    return next();
} 