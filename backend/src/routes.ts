import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer";
import { CreateUserController } from "./controllers/user/createUserController";
import { CreateUserAdminController } from "./controllers/user/createUserAdminController";
import { UpdateUserAdminController } from "./controllers/user/updateUserAdminController";
import { validateSchema } from "./middlewares/validateSchema";
import { createUserSchema, authUserSchema, createUserAdminSchema, updateUserAdminSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/authUserController";
import { DetailUserController } from "./controllers/user/detailUserController";
import { isAuth } from "./middlewares/isAuth";
import { CreateCategoryController } from "./controllers/category/createCategoryController";
import { isAdmin } from "./middlewares/isAdmin";
import { createCategorySchema } from "./schemas/categorySchema";
import { ListCategoryController } from "./controllers/category/listCategoryController";
import { CreateProductController } from "./controllers/product/createProductController";
import { createProductSchema, listProductByCategorySchema, listProductSchema } from "./schemas/productSchema";
import { ListProductController } from "./controllers/product/listProductController";
import { DeleteProductController } from "./controllers/product/deleteProductController";
import { ListProductByCategoryController } from "./controllers/product/listProductByCategoryController";
import { ListOrdersController } from "./controllers/orders/listOrdersController";
import { addItemOrderSchema, createOrderSchema, deleteOrderSchema, detailOrderSchema, finishOrderSchema, removeOrderItemSchema, sendOrderSchema, updateStageSchema } from "./schemas/orderSchema";
import { CreateOrderController } from "./controllers/orders/createOrderController";
import { AddItemOrderController } from "./controllers/orders/addItemOrderController";
import { RemoveOrderItemController } from "./controllers/orders/removeOrderItemController";
import { DetailOrderController } from "./controllers/orders/detailOrderController";
import { SendOrderController } from "./controllers/orders/SendOrderController";
import { FinishOrderController } from "./controllers/orders/finishOrderController";
import { DeleteOrderController } from "./controllers/orders/deleteOrderController";
import { ToggleProductController } from "./controllers/product/ToggleProductController";
import { UpdateStageOrderController } from "./controllers/orders/updateStageOrderController";
import { ListUsersController } from "./controllers/user/listUsersController";
import { DeleteUserController } from "./controllers/user/deleteUserController";

const router = Router();
const upload = multer(uploadConfig);

// User routes
router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle) // Criar usuário
router.post("/users/admin", isAuth, isAdmin, validateSchema(createUserAdminSchema), new CreateUserAdminController().handle) // Criar usuário como admin
router.put("/users/admin", isAuth, isAdmin, validateSchema(updateUserAdminSchema), new UpdateUserAdminController().handle) // Edit admin usuário
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle) // Autenticar usuário 
router.get("/me", isAuth, new DetailUserController().handle) // Detalhes do usuário logado (precisa estar autenticado para acessar)
router.get("/users", isAuth, isAdmin, new ListUsersController().handle); // Lista todos os usuários (apenas admin)
router.delete("/user", isAuth, isAdmin, new DeleteUserController().handle); // Lista todos os usuários (apenas admin)

// Category routes
router.post("/categories", isAuth, isAdmin, validateSchema(createCategorySchema), new CreateCategoryController().handle) // Cria categoria
router.get("/categories", isAuth, new ListCategoryController().handle) // Lista categorias)

// Product routes
router.post(
    "/products",
    isAuth,
    isAdmin,
    upload.single("file"),
    validateSchema(createProductSchema),
    new CreateProductController().handle
)
router.get("/products", isAuth, validateSchema(listProductSchema), new ListProductController().handle)
router.delete("/product", isAuth, isAdmin, new DeleteProductController().handle)
router.put("/product/status", isAuth, isAdmin, new ToggleProductController().handle)
router.get("/category/products", isAuth, validateSchema(listProductByCategorySchema), new ListProductByCategoryController().handle)

// Order routes
router.post("/order", isAuth, validateSchema(createOrderSchema), new CreateOrderController().handle); // Cria order
router.delete("/order", isAuth, validateSchema(deleteOrderSchema), new DeleteOrderController().handle); // Deleta order
router.get("/orders", isAuth, new ListOrdersController().handle); // Lista todas as orders

// Adicionar, remover e detalhar item de uma order
router.post("/order/add", isAuth, validateSchema(addItemOrderSchema), new AddItemOrderController().handle); // Adiciona item na order
router.delete("/order/remove", isAuth, validateSchema(removeOrderItemSchema), new RemoveOrderItemController().handle) // Remove item da order
router.get("/order/details", isAuth, validateSchema(detailOrderSchema), new DetailOrderController().handle) // Detalha order

router.put("/order/send", isAuth, validateSchema(sendOrderSchema), new SendOrderController().handle) // Encaminha pedido para a cozinha
router.put("/order/finish", isAuth, validateSchema(finishOrderSchema), new FinishOrderController().handle) // Cozinha finaliza o pedido
router.put("/order/stage", isAuth, validateSchema(updateStageSchema), new UpdateStageOrderController().handle) // Atualiza o estágio do pedido na pipeline

export { router };

// ARQUITETURA EM CAMADAS: ROUTES - CONTROLLER - SERVICE - REPOSITORY

// CONTROLLER: Lida com a lógica de negócio e as regras de negócio da aplicação. Ele recebe as requisições do cliente, processa os dados e retorna a resposta adequada. O controller é responsável por coordenar as ações entre o serviço e o repositório.
// SERVICE: Contém a lógica de negócio da aplicação. Ele é responsável por realizar as operações necessárias para atender às requisições do controller, como validação de dados, cálculos, etc. O serviço pode chamar o repositório para acessar os dados do banco de dados.
// REPOSITORY: Responsável por interagir com o banco de dados. Ele é responsável por realizar as operações de leitura e escrita no banco de dados, como criar, ler, atualizar e excluir registros. O repositório é a camada mais próxima do banco de dados e é responsável por abstrair a complexidade da interação com o banco de dados para as camadas superiores.