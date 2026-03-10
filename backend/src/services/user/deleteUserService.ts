import { prismaClient } from "../../prisma";

export class DeleteUserService {
    // Aqui, em vez de excluir o produto do banco de dados, vamos apenas marcar ele como desabilitado (soft delete) para manter o histórico e evitar problemas de integridade referencial com outros registros que possam estar relacionados a ele (como pedidos, por exemplo).
    async execute(userId: string) {
        try {
            await prismaClient.user.delete({
                where: { id: userId }
            });

            return { message: "Product deleted successfully" };

        } catch (err) {
            throw new Error("Error deleting product");
        }
    }
}