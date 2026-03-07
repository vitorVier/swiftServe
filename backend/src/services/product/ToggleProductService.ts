import { prismaClient } from "../../prisma";

interface ProductRequest {
    product_id: string;
    disabled: boolean;
}

class ToggleProductService {
    async execute({ product_id, disabled }: ProductRequest) {
        if (!product_id) {
            throw new Error("ID do produto é obrigatório");
        }

        const product = await prismaClient.product.update({
            where: {
                id: product_id
            },
            data: {
                disabled: disabled
            }
        });

        return product;
    }
}

export { ToggleProductService }
