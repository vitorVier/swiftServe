import { prismaClient } from "../../prisma";
import { cloudinary } from "../../config/cloudinary";
import { Readable } from "node:stream";

interface CreateProductServiceProps {
    name: string;
    price: number;
    description: string;
    categoryId: string;
    imageBuffer: Buffer;
    imageName: string;
}

export class CreateProductService {
    // Recebe os dados do produto, envia a imagem para o cloudinary, salva a url da imagem e os dados do produto no banco de dados
    async execute({ name, price, description, categoryId, imageBuffer, imageName }: CreateProductServiceProps) {
        const categoryExists = await prismaClient.category.findFirst({
            where: { id: categoryId }
        })
        if (!categoryExists) throw new Error("Category not found!");

        // ENVIAR PRO CLOUDINARY SALVAR A IMAGEM E PEGAR A URL
        let bannerUrl = "";

        try {
            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: "products",
                    resource_type: "image",
                    public_id: `${Date.now()}-${imageName.split(".")[0]}`
                }, (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })

                // Criar um stream do buffer e fazer pipe para o cloudinary
                const bufferStream = Readable.from(imageBuffer);
                bufferStream.pipe(uploadStream);
            })

            // bannerUrl = result.secure_url;
            bannerUrl = result.secure_url;
        } catch (err) {
            throw new Error("Error uploading image")
        }

        // SALVAR A URL DA IMAGEM E OS DADOS NO BANCO COMO UM NOVO PRODUTO
        const product = await prismaClient.product.create({
            data: {
                name: name,
                price: price,
                description: description,
                banner: bannerUrl,
                categoryId: categoryId,
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                categoryId: true,
                banner: true,
                createdAt: true,
            }
        })

        return product;
    }
}