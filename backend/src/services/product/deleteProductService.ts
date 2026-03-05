import { prismaClient } from "../../prisma";

export class DeleteProductService {
    // Aqui, em vez de excluir o produto do banco de dados, vamos apenas marcar ele como desabilitado (soft delete) para manter o histórico e evitar problemas de integridade referencial com outros registros que possam estar relacionados a ele (como pedidos, por exemplo).
    async execute(productId: string) {
        try {
            await prismaClient.product.update({
                where: { id: productId },
                data: { disabled: true }
            });

            return { message: "Product deleted successfully" };

        } catch(err) {
            throw new Error("Error deleting product");
        }
    }
}