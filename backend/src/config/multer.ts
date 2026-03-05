import multer from "multer";

// Usar memoryStorage para armazenar arquivos em memória e enviar diretamente para o Cloudinary
export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    },
    fileFilter: (_: any, file: Express.Multer.File, cb: any) => {
        const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];

        if(allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPEG, PNG and JPG are allowed."), false);
        }
    }
}