# 📋 Documentação de Contexto do Projeto - Sistema de Pizzaria

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias e Versões](#tecnologias-e-versões)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
6. [Middlewares](#middlewares)
7. [Validação com Schemas](#validação-com-schemas)
8. [Endpoints](#endpoints)
9. [Fluxo de Requisição](#fluxo-de-requisição)
10. [Configurações do Projeto](#configurações-do-projeto)

---

## 🎯 Visão Geral

Sistema backend de gerenciamento de pizzaria desenvolvido em Node.js com TypeScript, utilizando Express como framework web, Prisma ORM para comunicação com banco de dados PostgreSQL, e Zod para validação de dados.

---

## 🏗️ Arquitetura

O projeto segue o padrão **MVC + Service Layer**, com a seguinte estrutura:

```
Requisição HTTP → Rotas → Middlewares → Controller → Service → Banco de Dados → Service → Controller → Resposta HTTP
```

### Camadas da Arquitetura:

1. **Rotas (`routes.ts`)**: Define os endpoints e aplica os middlewares
2. **Middlewares**: Validação de schema, autenticação e autorização
3. **Controllers**: Recebem a requisição, extraem dados e delegam para o Service
4. **Services**: Contêm toda a lógica de negócio e comunicação com o banco de dados
5. **Prisma Client**: ORM que gerencia a comunicação com PostgreSQL

### Princípios Seguidos:

- **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
- **Single Responsibility Principle**: Um controller/service para cada operação
- **Reutilização**: Middlewares compartilhados entre rotas
- **Validação Centralizada**: Schemas Zod validam dados antes de chegarem ao controller

---

## 🚀 Tecnologias e Versões

### Dependências de Produção

| Tecnologia         | Versão  | Finalidade                                         |
| ------------------ | ------- | -------------------------------------------------- |
| **express**        | ^5.1.0  | Framework web para criação de APIs REST            |
| **@prisma/client** | ^6.19.0 | ORM para comunicação com banco de dados            |
| **typescript**     | ^5.9.3  | Superset JavaScript com tipagem estática           |
| **zod**            | ^4.1.12 | Biblioteca de validação de schemas e tipagem       |
| **bcryptjs**       | ^3.0.3  | Criptografia de senhas                             |
| **jsonwebtoken**   | ^9.0.2  | Geração e validação de tokens JWT                  |
| **cors**           | ^2.8.5  | Middleware para habilitar CORS                     |
| **dotenv**         | ^17.2.3 | Carregamento de variáveis de ambiente              |
| **multer**         | ^2.1.0  | Upload de arquivos (imagens de produtos)           |
| **cloudinary**     | ^2.x    | Serviço de armazenamento de imagens em nuvem       |
| **tsx**            | ^4.20.6 | Executor TypeScript para desenvolvimento           |

### Dependências de Desenvolvimento

| Tecnologia              | Versão   | Finalidade                       |
| ----------------------- | -------- | -------------------------------- |
| **@types/express**      | ^5.0.5   | Tipos TypeScript para Express    |
| **@types/cors**         | ^2.8.19  | Tipos TypeScript para CORS       |
| **@types/jsonwebtoken** | ^9.0.10  | Tipos TypeScript para JWT        |
| **@types/bcryptjs**     | latest   | Tipos TypeScript para bcryptjs   |
| **@types/multer**       | latest   | Tipos TypeScript para multer     |
| **@types/node**         | ^24.10.0 | Tipos TypeScript para Node.js    |
| **prisma**              | ^6.19.0  | CLI do Prisma ORM                |

### Banco de Dados

- **PostgreSQL** (gerenciado via Prisma ORM)

---

## 📁 Estrutura de Pastas

```
backend/
├── prisma/
│   ├── migrations/           # Histórico de migrações do banco
│   │   └── 20251110200355_create_tables/
│   │       └── migration.sql
│   ├── migration_lock.toml   # Lock de migrações
│   └── schema.prisma         # Schema do banco de dados
├── src/
│   ├── @types/               # Definições de tipos TypeScript customizados
│   │   └── express/
│   │       └── index.d.ts    # Extensão de tipos do Express (adiciona user_id ao req)
│   ├── config/               # Configurações da aplicação
│   │   ├── multer.ts         # Configuração do multer (upload de arquivos)
│   │   └── cloudinary.ts     # Configuração do Cloudinary (armazenamento de imagens)
│   ├── controllers/          # Controllers (recebem requisições e retornam respostas)
│   │   ├── category/
│   │   │   ├── createCategoryController.ts
│   │   │   └── listCategoryController.ts
│   │   ├── user/
│   │   │   ├── authUserController.ts
│   │   │   ├── createUserController.ts
│   │   │   └── detailUserController.ts
│   │   ├── product/
│   │   │   ├── createProductController.ts
│   │   │   ├── deleteProductController.ts    # Recebe productId via query
│   │   │   ├── listProductController.ts
│   │   │   └── listProductByCategoryController.ts
│   │   └── orders/
│   │       ├── createOrderController.ts
│   │       ├── deleteOrderController.ts
│   │       ├── listOrdersController.ts       # Aceita query param ?draft=
│   │       ├── detailOrderController.ts
│   │       ├── addItemOrderController.ts
│   │       ├── removeOrderItemController.ts
│   │       ├── SendOrderController.ts
│   │       └── finishOrderController.ts
│   ├── generated/            # Código gerado pelo Prisma
│   │   └── prisma/
│   │       └── client.ts
│   ├── middlewares/          # Middlewares customizados
│   │   ├── isAdmin.ts        # Verifica se usuário é ADMIN (usa user_id do req)
│   │   ├── isAuth.ts         # Valida JWT e injeta user_id no req
│   │   └── validateSchema.ts # Valida body/query/params com Zod
│   ├── prisma/               # Configuração do Prisma Client
│   │   └── index.ts
│   ├── schemas/              # Schemas de validação Zod
│   │   ├── categorySchema.ts
│   │   ├── userSchema.ts
│   │   ├── productSchema.ts
│   │   └── orderSchema.ts
│   ├── services/             # Services (lógica de negócio + acesso ao banco)
│   │   ├── category/
│   │   │   ├── createCategoryService.ts
│   │   │   └── listCategoryService.ts
│   │   ├── user/
│   │   │   ├── authUserService.ts
│   │   │   ├── createUserService.ts
│   │   │   └── detailUserService.ts
│   │   ├── product/
│   │   │   ├── createProductService.ts      # Faz upload pro Cloudinary
│   │   │   ├── deleteProductService.ts      # Soft delete via disabled=true
│   │   │   ├── listProductService.ts
│   │   │   └── listProductByCategoryService.ts
│   │   └── orders/
│   │       ├── createOrderService.ts
│   │       ├── deleteOrderService.ts
│   │       ├── listOrdersService.ts
│   │       ├── detailOrderService.ts
│   │       ├── addItemOrderService.ts
│   │       ├── removeOrderItemService.ts
│   │       ├── sendOrderService.ts
│   │       └── finishOrderService.ts
│   ├── routes.ts             # Definição de todas as rotas
│   └── server.ts             # Configuração e inicialização do servidor
├── .env                      # Variáveis de ambiente
├── package.json              # Dependências e scripts
├── prisma.config.ts          # Configurações adicionais do Prisma
└── tsconfig.json             # Configurações do TypeScript

```

### Convenções de Nomenclatura:

- **Controllers**: `<Action><Entity>Controller.ts` (ex: `CreateUserController.ts`)
- **Services**: `<Action><Entity>Service.ts` (ex: `CreateUserService.ts`)
- **Schemas**: `<entity>Schema.ts` (ex: `userSchema.ts`)
- **Middlewares**: `<description>.ts` (ex: `isAuthenticated.ts`)

---

## 🗄️ Modelagem do Banco de Dados

### Diagrama de Relacionamentos

```
User (1)
  └─ role: STAFF | ADMIN

Category (1) ─────< (N) Product
                         │
                         └─< (N) Item >─┐
                                        │
Order (1) ─────────────────────────────┘
  └─ items: Item[]
```

### Entidades e Atributos

#### **User** (Usuários do Sistema)

```typescript
{
  id: string(UUID); // Identificador único
  name: string; // Nome completo
  email: string(unique); // Email (único)
  password: string; // Senha criptografada (bcrypt)
  role: Role; // STAFF ou ADMIN
  createdAt: DateTime; // Data de criação
  updatedAt: DateTime; // Data de atualização
}
```

**Enum Role:**

- `STAFF` - Funcionário padrão
- `ADMIN` - Administrador (acesso total)

#### **Category** (Categorias de Produtos)

```typescript
{
  id: string (UUID)          // Identificador único
  name: string               // Nome da categoria
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
  products: Product[]        // Produtos desta categoria
}
```

#### **Product** (Produtos/Pizzas)

```typescript
{
  id: string (UUID)          // Identificador único
  name: string               // Nome do produto
  price: number (int)        // Preço em centavos
  description: string        // Descrição do produto
  banner: string             // URL da imagem
  disabled: boolean          // Produto ativo/inativo
  category_id: string        // FK para Category
  category: Category         // Relação com categoria
  items: Item[]              // Itens de pedidos deste produto
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
}
```

**Observação sobre preço**: O preço é armazenado em **centavos** (inteiro) para evitar problemas com aritmética de ponto flutuante.

#### **Order** (Pedidos)

```typescript
{
  id: string (UUID)          // Identificador único
  table: number (int)        // Número da mesa
  status: boolean            // false = aberto, true = fechado
  draft: boolean             // true = rascunho, false = confirmado
  name: string?              // Nome opcional para o pedido
  items: Item[]              // Itens do pedido
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
}
```

#### **Item** (Itens dos Pedidos)

```typescript
{
  id: string(UUID); // Identificador único
  amount: number(int); // Quantidade
  order_id: string; // FK para Order
  order: Order; // Relação com pedido
  product_id: string; // FK para Product
  product: Product; // Relação com produto
  createdAt: DateTime; // Data de criação
  updatedAt: DateTime; // Data de atualização
}
```

### Regras de Deleção (Cascade)

- **Product** deletado → Deleta todos os **Items** relacionados
- **Order** deletado → Deleta todos os **Items** relacionados
- **Category** deletada → Deleta todos os **Products** relacionados

---

## 🛡️ Middlewares

### 1. **isAuth** (`middlewares/isAuth.ts`)

**Função**: Valida se o usuário está autenticado verificando o token JWT.

**Fluxo**:

1. Extrai o token do header `Authorization: Bearer <token>`
2. Verifica a validade do token usando `jsonwebtoken`
3. Extrai o `user_id` do campo `sub` do payload do token
4. Adiciona `user_id` ao objeto `req` para uso nos próximos middlewares/controllers
5. Chama `next()` se válido, ou retorna erro 401 se inválido

**Uso**:

```typescript
router.get("/me", isAuth, new DetailUserController().handle);
```

**Respostas de Erro**:

- `401`: Token não fornecido ou inválido

---

### 2. **isAdmin** (`middlewares/isAdmin.ts`)

**Função**: Verifica se o usuário autenticado tem permissão de ADMIN.

**Pré-requisito**: Deve ser usado **após** o middleware `isAuth`.

**Fluxo**:

1. Obtém `user_id` do `req` (adicionado pelo `isAuth`)
2. Busca o usuário no banco de dados
3. Verifica se o campo `role` é igual a `"ADMIN"`
4. Chama `next()` se for admin, ou retorna erro 401 se não for

**Uso**:

```typescript
router.post(
  "/categories",
  isAuth,
  isAdmin,
  new CreateCategoryController().handle
);
```

**Respostas de Erro**:

- `401`: Usuário sem permissão

---

### 3. **validateSchema** (`middlewares/validateSchema.ts`)

**Função**: Valida dados da requisição (body, query, params) usando schemas Zod.

**Fluxo**:

1. Recebe um schema Zod como parâmetro
2. Valida `req.body`, `req.query` e `req.params` contra o schema
3. Chama `next()` se válido
4. Retorna erro 400 com detalhes da validação se inválido

**Uso**:

```typescript
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle
);
```

**Respostas de Erro**:

- `400`: Erro de validação com detalhes dos campos inválidos
- `500`: Erro interno do servidor

**Exemplo de resposta de erro**:

```json
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no minimo 3 letras" },
    { "message": "Precisa ser um email valido" }
  ]
}
```

---

## ✅ Validação com Schemas

Utilizamos **Zod** para validação de dados de entrada. Os schemas ficam organizados na pasta `src/schemas/`.

### User Schemas (`schemas/userSchema.ts`)

#### **createUserSchema**

Valida criação de novos usuários:

```typescript
{
  body: {
    name: string (min: 3 caracteres),
    email: email válido,
    password: string (min: 6 caracteres)
  }
}
```

**Mensagens de erro customizadas**:

- Nome inválido: "O nome precisa ter no minimo 3 letras"
- Email inválido: "Precisa ser um email valido"
- Senha inválida: "A senha deve ter no minimo 6 caracteres"

#### **authUserSchema**

Valida autenticação de usuários:

```typescript
{
  body: {
    email: email válido,
    password: string (obrigatório)
  }
}
```

### Category Schemas (`schemas/categorySchema.ts`)

#### **createCategorySchema**

Valida criação de categorias:

```typescript
{
  body: {
    name: string (min: 2 caracteres)
  }
}
```

**Mensagens de erro**:

- Nome inválido: "Nome da categoria precisa ter 2 caracteres"

### Product Schemas (`schemas/productSchema.ts`)

| Schema                        | Fonte   | Campos                                                                        |
| ----------------------------- | ------- | ----------------------------------------------------------------------------- |
| `createProductSchema`         | `body`  | `name`, `price` (string numérica), `description`, `categoryId`               |
| `listProductSchema`           | `query` | `disabled?` (`"true"` \| `"false"`, padrão `"false"`, transforma p/ boolean) |
| `listProductByCategorySchema` | `query` | `categoryId` (obrigatório)                                                    |

### Order Schemas (`schemas/orderSchema.ts`)

| Schema                  | Fonte   | Campos obrigatórios                         |
| ----------------------- | ------- | ------------------------------------------- |
| `createOrderSchema`     | `body`  | `table` (int positivo), `name?` (string)    |
| `addItemOrderSchema`    | `body`  | `orderId`, `productId`, `amount` (int >= 1) |
| `removeOrderItemSchema` | `query` | `itemId`                                    |
| `detailOrderSchema`     | `query` | `orderId`                                   |
| `sendOrderSchema`       | `body`  | `orderId`, `name?`                          |
| `finishOrderSchema`     | `body`  | `orderId`                                   |
| `deleteOrderSchema`     | `query` | `orderId`                                   |

---

## 🌐 Endpoints

> 📖 Para a referência completa de endpoints com todos os exemplos de request/response, consulte o arquivo [endpoints.md](./endpoints.md).

### Mapa de Rotas

| Método   | Rota                    | Controller                          | Service                          | Middlewares                                              |
| -------- | ----------------------- | ----------------------------------- | -------------------------------- | -------------------------------------------------------- |
| `POST`   | `/users`                | `CreateUserController`              | `CreateUserService`              | `validateSchema(createUserSchema)`                       |
| `POST`   | `/session`              | `AuthUserController`                | `AuthUserService`                | `validateSchema(authUserSchema)`                         |
| `GET`    | `/me`                   | `DetailUserController`              | `DetailUserService`              | `isAuth`                                                 |
| `POST`   | `/categories`           | `CreateCategoryController`          | `CreateCategoryService`          | `isAuth`, `isAdmin`, `validateSchema(createCategorySchema)` |
| `GET`    | `/categories`           | `ListCategoryController`            | `ListCategoryService`            | `isAuth`                                                 |
| `POST`   | `/products`             | `CreateProductController`           | `CreateProductService`           | `isAuth`, `isAdmin`, `multer.single("file")`, `validateSchema(createProductSchema)` |
| `GET`    | `/products`             | `ListProductController`             | `ListProductService`             | `isAuth`, `validateSchema(listProductSchema)`            |
| `DELETE` | `/product`              | `DeleteProductController`           | `DeleteProductService`           | `isAuth`, `isAdmin`                                      |
| `GET`    | `/category/products`    | `ListProductByCategoryController`   | `ListProductByCategoryService`   | `isAuth`, `validateSchema(listProductByCategorySchema)`  |
| `POST`   | `/order`                | `CreateOrderController`             | `CreateOrderService`             | `isAuth`, `validateSchema(createOrderSchema)`            |
| `DELETE` | `/order`                | `DeleteOrderController`             | `DeleteOrderService`             | `isAuth`, `validateSchema(deleteOrderSchema)`            |
| `GET`    | `/orders`               | `ListOrdersController`              | `ListOrdersService`              | `isAuth`                                                 |
| `GET`    | `/order/detail`         | `DetailOrderController`             | `DetailOrderService`             | `isAuth`, `validateSchema(detailOrderSchema)`            |
| `POST`   | `/order/add`            | `AddItemOrderController`            | `AddItemOrderService`            | `isAuth`, `validateSchema(addItemOrderSchema)`           |
| `DELETE` | `/order/remove`         | `RemoveOrderItemController`         | `RemoveOrderItemService`         | `isAuth`, `validateSchema(removeOrderItemSchema)`        |
| `PUT`    | `/order/send`           | `SendOrderController`               | `SendOrderService`               | `isAuth`, `validateSchema(sendOrderSchema)`              |
| `PUT`    | `/order/finish`         | `FinishOrderController`             | `FinishOrderService`             | `isAuth`, `validateSchema(finishOrderSchema)`            |

### **Usuários**

#### **POST /users** — Criar Usuário

**Middlewares**: `validateSchema(createUserSchema)`  
**Body**: `{ name, email, password }`  
**Resposta (200)**: `{ id, name, email, role, createdAt }` (sem senha)

#### **POST /session** — Login

**Middlewares**: `validateSchema(authUserSchema)`  
**Body**: `{ email, password }`  
**Resposta (200)**: `{ id, name, email, role, token }` — JWT expira em 30 dias

#### **GET /me** — Perfil do Usuário

**Middlewares**: `isAuth`  
**Header**: `Authorization: Bearer <token>`  
**Resposta (200)**: `{ id, name, email, role, createdAt }`

---

### **Categorias**

#### **POST /categories** — Criar Categoria

**Middlewares**: `isAuth`, `isAdmin`, `validateSchema(createCategorySchema)`  
**Body**: `{ name }`  
**Resposta (200)**: `{ id, name, createdAt }`

#### **GET /categories** — Listar Categorias

**Middlewares**: `isAuth`  
**Resposta (200)**: Array de `{ id, name, createdAt }`, ordenado por `createdAt DESC`

---

### **Produtos**

#### **POST /products** — Criar Produto

**Middlewares**: `isAuth`, `isAdmin`, `multer.single("file")`, `validateSchema(createProductSchema)`  
**Content-Type**: `multipart/form-data`  
**Campos**: `name`, `price` (string numérica em centavos), `description`, `categoryId`, `file`  
**Resposta (200)**: `{ id, name, price, description, banner (URL Cloudinary), categoryId, createdAt }`

#### **GET /products** — Listar Produtos

**Middlewares**: `isAuth`, `validateSchema(listProductSchema)`  
**Query**: `?disabled=false` (padrão) | `?disabled=true`  
**Resposta (200)**: Array com dados do produto + objeto `category`

#### **DELETE /product** — Desativar Produto (Soft Delete)

**Middlewares**: `isAuth`, `isAdmin`  
**Query**: `?productId=<uuid>`  
**Resposta (200)**: `{ message: "Product deleted successfully" }`

#### **GET /category/products** — Listar Produtos por Categoria

**Middlewares**: `isAuth`, `validateSchema(listProductByCategorySchema)`  
**Query**: `?categoryId=<uuid>`  
**Resposta (200)**: Array de produtos ativos daquela categoria + objeto `category`

---

### **Pedidos (Orders)**

#### **POST /order** — Criar Pedido

**Middlewares**: `isAuth`, `validateSchema(createOrderSchema)`  
**Body**: `{ table: number, name?: string }`  
**Resposta (200)**: `{ id, table, status: false, draft: true, name, createdAt }`

#### **DELETE /order** — Deletar Pedido

**Middlewares**: `isAuth`, `validateSchema(deleteOrderSchema)`  
**Query**: `?orderId=<uuid>`  
**Resposta (200)**: `{ message: "Pedido deletado com sucesso!" }`

#### **GET /orders** — Listar Pedidos

**Middlewares**: `isAuth`  
**Query**: `?draft=false` (padrão) | `?draft=true`  
**Resposta (200)**: Pedido com array de `items` + dados de `product` em cada item

#### **GET /order/detail** — Detalhes do Pedido

**Middlewares**: `isAuth`, `validateSchema(detailOrderSchema)`  
**Query**: `?orderId=<uuid>`  
**Resposta (200)**: Pedido completo com `items[]` → `{ id, amount, createdAt, product: { id, name, price, description, banner } }`

---

### **Itens de Pedido**

#### **POST /order/add** — Adicionar Item

**Middlewares**: `isAuth`, `validateSchema(addItemOrderSchema)`  
**Body**: `{ orderId, productId, amount }`  
**Validações**: `orderId` deve existir; `productId` deve existir com `disabled: false`  
**Resposta (200)**: `{ id, amount, orderId, productId, createdAt, product: { id, name, price, description, banner } }`

#### **DELETE /order/remove** — Remover Item

**Middlewares**: `isAuth`, `validateSchema(removeOrderItemSchema)`  
**Query**: `?itemId=<uuid>`  
**Resposta (200)**: `{ message: "Item removed successfully" }`

---

### **Fluxo do Pedido**

#### **PUT /order/send** — Enviar para Cozinha

**Middlewares**: `isAuth`, `validateSchema(sendOrderSchema)`  
**Body**: `{ orderId, name? }`  
**Efeito**: `draft: false` — pedido confirmado e visível para cozinha  
**Resposta (200)**: `{ id, table, name, draft: false, status, createdAt }`

#### **PUT /order/finish** — Finalizar Pedido

**Middlewares**: `isAuth`, `validateSchema(finishOrderSchema)`  
**Body**: `{ orderId }`  
**Efeito**: `status: true` — pedido finalizado pela cozinha  
**Resposta (200)**: `{ id, table, name, draft, status: true, createdAt }`

---

### Ciclo de Vida de um Pedido

```
[RASCUNHO]  POST /order          → draft: true,  status: false
            POST /order/add       → Adiciona itens
            DELETE /order/remove  → Remove itens
[COZINHA]   PUT /order/send       → draft: false, status: false
[PRONTO]    PUT /order/finish     → draft: false, status: true
```

---

## 🔄 Fluxo de Requisição

### Exemplo Completo: Criação de Usuário

```
1. POST /users
   ↓
2. Middleware: validateSchema(createUserSchema)
   - Valida name, email, password
   - Se inválido → 400 com erros
   ↓
3. CreateUserController.handle()
   - Extrai dados do req.body
   - Instancia CreateUserService
   - Chama service.execute()
   ↓
4. CreateUserService.execute()
   - Verifica se email já existe
   - Se existe → throw Error("Usuário já existente!")
   - Criptografa senha com bcrypt
   - Cria usuário no banco via Prisma
   - Retorna dados do usuário (sem senha)
   ↓
5. CreateUserController.handle()
   - Recebe dados do service
   - Retorna res.json(user)
   ↓
6. Resposta HTTP 200 com dados do usuário
```

### Fluxo com Autenticação e Autorização

```
1. POST /category
   ↓
2. Middleware: isAuthenticated
   - Valida token JWT
   - Adiciona user_id ao req
   - Se inválido → 401
   ↓
3. Middleware: isAdmin
   - Busca usuário no banco
   - Verifica role === "ADMIN"
   - Se não for admin → 401
   ↓
4. Middleware: validateSchema(createCategorySchema)
   - Valida dados
   - Se inválido → 400
   ↓
5. CreateCategoryController → CreateCategoryService
   - Lógica de negócio
   - Criação no banco
   ↓
6. Resposta HTTP 201
```

---

## ⚙️ Configurações do Projeto

### TypeScript (`tsconfig.json`)

**Configurações Principais**:

- **Target**: ES2020
- **Module**: CommonJS (compatível com Node.js)
- **Strict Mode**: Ativado (todas verificações rigorosas)
- **Output**: `./dist`
- **Root**: `./src`
- **Source Maps**: Habilitado

**Verificações Estritas Ativas**:

- `noImplicitAny`: Proíbe tipos `any` implícitos
- `strictNullChecks`: Tratamento rigoroso de null/undefined
- `noUnusedLocals`: Erro para variáveis não usadas
- `noUnusedParameters`: Erro para parâmetros não usados
- `noImplicitReturns`: Todos os caminhos devem retornar valor

---

### Prisma (`prisma/schema.prisma`)

**Generator**:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Cliente Prisma é gerado em `src/generated/prisma/`.

**Datasource**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Convenções**:

- Nomes de models em PascalCase (ex: `User`)
- Nomes de tabelas em snake_case (ex: `users`)
- IDs: UUID gerado automaticamente
- Timestamps automáticos: `createdAt`, `updatedAt`

---

### Express Server (`server.ts`)

**Middlewares Globais**:

1. `express.json()` - Parse de requisições JSON
2. `cors()` - Habilita CORS para todas as origens
3. `router` - Rotas da aplicação

**Error Handler Global**:

```typescript
app.use((error: Error, _, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Internal server error!" });
});
```

**Porta**:

- Padrão: `3333`
- Configurável via variável de ambiente `PORT`

---

### Variáveis de Ambiente (`.env`)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pizzaria?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-aqui"

# Server
PORT=3333
```

**Variáveis Obrigatórias**:

- `DATABASE_URL`: String de conexão PostgreSQL
- `JWT_SECRET`: Chave secreta para assinar tokens JWT

---

### Scripts NPM (`package.json`)

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

**Comando de Desenvolvimento**:

```bash
npm run dev
```

- Executa servidor com hot-reload
- Usa `tsx` para executar TypeScript diretamente

**Comandos Prisma**:

```bash
# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio

# Gerar Prisma Client
npx prisma generate
```

---

## 🔐 Segurança

### Autenticação

- **JWT (JSON Web Tokens)** para autenticação stateless
- Tokens devem ser enviados no header: `Authorization: Bearer <token>`
- Token contém `user_id` no campo `sub`

### Autorização

- Sistema de roles: `STAFF` e `ADMIN`
- Rotas protegidas por middlewares `isAuthenticated` e `isAdmin`

### Criptografia

- **bcryptjs** com salt de 8 rounds para senhas
- Senhas nunca são retornadas nas respostas da API

### Validação

- **Zod** valida todos os inputs antes de chegarem à lógica de negócio
- Mensagens de erro customizadas e amigáveis

---

## 📝 Observações Importantes

1. **Preços em Centavos**: Todos os preços são armazenados como inteiros em centavos para evitar problemas com ponto flutuante.

2. **UUIDs**: Todos os IDs são UUIDs v4 gerados automaticamente pelo Prisma.

3. **Timestamps Automáticos**: `createdAt` e `updatedAt` são gerenciados automaticamente pelo Prisma.

4. **Cascade Delete**: Deleções em cascata estão configuradas para manter integridade referencial.

5. **Error Handling**: Todos os erros são capturados pelo error handler global do Express.

6. **Type Safety**: TypeScript configurado no modo strict garante segurança de tipos em todo o código.

7. **Prisma Client Customizado**: Cliente gerado em `src/generated/prisma` para melhor organização.

---

## 🚀 Como Iniciar o Projeto

1. **Instalar dependências**:

```bash
npm install
```

2. **Configurar variáveis de ambiente**:

```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. **Executar migrações**:

```bash
npx prisma migrate dev
```

4. **Iniciar servidor**:

```bash
npm run dev
```

5. **Servidor rodando em**: `http://localhost:3333`

---

> 📖 Consulte também: [endpoints.md](./endpoints.md) — Referência completa de todos os endpoints com exemplos detalhados de request/response.

**Documento atualizado em**: 01/03/2026  
**Versão do Projeto**: 1.0.0
