# 🍕 Pizzeria API — Referência Completa de Endpoints

> **Base URL**: `http://localhost:3333`  
> **Autenticação**: `Authorization: Bearer <token>` (JWT)  
> **Conteúdo**: `Content-Type: application/json` (exceto onde indicado `multipart/form-data`)

---

## 📋 Índice

| Grupo        | Método   | Rota                    | Descrição                             | Auth | Admin |
| ------------ | -------- | ----------------------- | ------------------------------------- | ---- | ----- |
| **Usuários** | `POST`   | `/users`                | Criar usuário                         | ❌    | ❌     |
| **Usuários** | `POST`   | `/session`              | Autenticar (login)                    | ❌    | ❌     |
| **Usuários** | `GET`    | `/me`                   | Detalhes do usuário logado            | ✅    | ❌     |
| **Categ.**   | `POST`   | `/categories`           | Criar categoria                       | ✅    | ✅     |
| **Categ.**   | `GET`    | `/categories`           | Listar categorias                     | ✅    | ❌     |
| **Produtos** | `POST`   | `/products`             | Criar produto (com imagem)            | ✅    | ✅     |
| **Produtos** | `GET`    | `/products`             | Listar produtos                       | ✅    | ❌     |
| **Produtos** | `DELETE` | `/product`              | Desativar produto (soft delete)       | ✅    | ✅     |
| **Produtos** | `GET`    | `/category/products`    | Listar produtos por categoria         | ✅    | ❌     |
| **Pedidos**  | `POST`   | `/order`                | Criar pedido (rascunho)               | ✅    | ❌     |
| **Pedidos**  | `DELETE` | `/order`                | Deletar pedido                        | ✅    | ❌     |
| **Pedidos**  | `GET`    | `/orders`               | Listar pedidos                        | ✅    | ❌     |
| **Pedidos**  | `GET`    | `/order/detail`         | Detalhes de um pedido                 | ✅    | ❌     |
| **Itens**    | `POST`   | `/order/add`            | Adicionar item ao pedido              | ✅    | ❌     |
| **Itens**    | `DELETE` | `/order/remove`         | Remover item do pedido                | ✅    | ❌     |
| **Fluxo**    | `PUT`    | `/order/send`           | Enviar pedido para cozinha            | ✅    | ❌     |
| **Fluxo**    | `PUT`    | `/order/finish`         | Cozinha finaliza o pedido             | ✅    | ❌     |

---

## 👤 Usuários

### `POST /users` — Criar Usuário

Registra um novo usuário no sistema. Role padrão é `STAFF`.

**Middlewares**: `validateSchema(createUserSchema)`

**Request Body** (`application/json`):

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

| Campo      | Tipo     | Obrigatório | Regras                    |
| ---------- | -------- | ----------- | ------------------------- |
| `name`     | `string` | ✅           | Mínimo 3 caracteres       |
| `email`    | `string` | ✅           | Email válido e único      |
| `password` | `string` | ✅           | Mínimo 6 caracteres       |

**Response `200 OK`**:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Erros**:

| Status | Mensagem                | Causa                         |
| ------ | ----------------------- | ----------------------------- |
| `400`  | Erros de validação Zod  | Campos inválidos ou ausentes  |
| `400`  | `User already exists`   | Email já cadastrado           |

---

### `POST /session` — Login / Autenticação

Autentica o usuário e retorna um token JWT com validade de **30 dias**.

**Middlewares**: `validateSchema(authUserSchema)`

**Request Body** (`application/json`):

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

| Campo      | Tipo     | Obrigatório | Regras               |
| ---------- | -------- | ----------- | -------------------- |
| `email`    | `string` | ✅           | Email válido         |
| `password` | `string` | ✅           | Mínimo 6 caracteres  |

**Response `200 OK`**:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm_DM28gU2lsdmEiLCJlbWFpbCI6Impvb..."
}
```

> O token contém `name` e `email` no payload, e `user_id` no campo `sub`. Expira em `30d`.

**Erros**:

| Status | Mensagem                          | Causa                        |
| ------ | --------------------------------- | ---------------------------- |
| `400`  | `Email e senha incorretos`        | Email não encontrado         |
| `400`  | `E-mail ou senha incorretos`      | Senha não confere            |

---

### `GET /me` — Detalhes do Usuário Logado

Retorna os dados do usuário atualmente autenticado.

**Middlewares**: `isAuth`

**Headers**:

```
Authorization: Bearer <token>
```

**Response `200 OK`**:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Erros**:

| Status | Mensagem            | Causa                        |
| ------ | ------------------- | ---------------------------- |
| `401`  | Token inválido      | Token ausente ou expirado    |
| `400`  | `User not found`    | Usuário não encontrado no BD |

---

## 🏷️ Categorias

### `POST /categories` — Criar Categoria

Cria uma nova categoria de produtos. Requer permissão de **ADMIN**.

**Middlewares**: `isAuth` → `isAdmin` → `validateSchema(createCategorySchema)`

**Headers**:

```
Authorization: Bearer <token-admin>
```

**Request Body** (`application/json`):

```json
{
  "name": "Pizzas Doces"
}
```

| Campo  | Tipo     | Obrigatório | Regras               |
| ------ | -------- | ----------- | -------------------- |
| `name` | `string` | ✅           | Mínimo 2 caracteres  |

**Response `200 OK`**:

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "name": "Pizzas Doces",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Erros**:

| Status | Mensagem                       | Causa                         |
| ------ | ------------------------------ | ----------------------------- |
| `401`  | Token inválido                 | Não autenticado               |
| `401`  | Sem permissão                  | Usuário não é ADMIN           |
| `400`  | Erros de validação Zod         | Campo `name` inválido         |
| `400`  | `Error creating category`      | Falha ao criar no banco       |

---

### `GET /categories` — Listar Categorias

Lista todas as categorias ordenadas pela data de criação (mais recente primeiro).

**Middlewares**: `isAuth`

**Headers**:

```
Authorization: Bearer <token>
```

**Response `200 OK`**:

```json
[
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Pizzas Salgadas",
    "createdAt": "2025-11-10T08:00:00.000Z"
  },
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Pizzas Doces",
    "createdAt": "2025-11-09T08:00:00.000Z"
  }
]
```

---

## 📦 Produtos

### `POST /products` — Criar Produto

Cria um novo produto com upload de imagem para o Cloudinary. Requer permissão de **ADMIN**.

**Middlewares**: `isAuth` → `isAdmin` → `multer.single("file")` → `validateSchema(createProductSchema)`

**Headers**:

```
Authorization: Bearer <token-admin>
Content-Type: multipart/form-data
```

**Request Body** (`multipart/form-data`):

| Campo         | Tipo     | Obrigatório | Regras                          |
| ------------- | -------- | ----------- | ------------------------------- |
| `name`        | `string` | ✅           | Mínimo 1 caractere              |
| `price`       | `string` | ✅           | Número inteiro (em centavos)    |
| `description` | `string` | ✅           | Mínimo 1 caractere              |
| `categoryId`  | `string` | ✅           | UUID de categoria existente     |
| `file`        | `File`   | ✅           | Imagem do produto               |

> ⚠️ `price` é enviado como **string** no form-data mas representa centavos. Ex: `4500` = R$ 45,00

**Response `200 OK`**:

```json
{
  "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "name": "Pizza Margherita",
  "price": 4500,
  "description": "Molho de tomate, mussarela e manjericão",
  "banner": "https://res.cloudinary.com/xxx/image/upload/v.../products/1234567890-pizza.jpg",
  "categoryId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Erros**:

| Status | Mensagem                  | Causa                      |
| ------ | ------------------------- | -------------------------- |
| `400`  | `Category not found!`     | `categoryId` inexistente   |
| `400`  | `Error uploading image`   | Falha no upload Cloudinary |

---

### `GET /products` — Listar Produtos

Lista produtos com filtro opcional por status (`disabled`). Padrão: lista somente produtos **ativos**.

**Middlewares**: `isAuth` → `validateSchema(listProductSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

| Param      | Tipo                  | Obrigatório | Padrão    | Descrição                             |
| ---------- | --------------------- | ----------- | --------- | ------------------------------------- |
| `disabled` | `"true"` \| `"false"` | ❌           | `"false"` | Filtrar produtos ativos ou desativos  |

**Exemplo de request**:

```
GET /products?disabled=false
GET /products?disabled=true
```

**Response `200 OK`**:

```json
[
  {
    "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "name": "Pizza Margherita",
    "price": 4500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../pizza.jpg",
    "disabled": false,
    "categoryId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "createdAt": "2025-11-11T10:30:00.000Z",
    "category": {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Pizzas Salgadas"
    }
  }
]
```

---

### `DELETE /product` — Desativar Produto (Soft Delete)

Marca o produto como desativado (`disabled: true`) sem removê-lo do banco de dados.

**Middlewares**: `isAuth` → `isAdmin`

**Headers**:

```
Authorization: Bearer <token-admin>
```

**Query Params**:

| Param       | Tipo     | Obrigatório | Descrição          |
| ----------- | -------- | ----------- | ------------------ |
| `productId` | `string` | ✅           | UUID do produto    |

**Exemplo de request**:

```
DELETE /product?productId=d4e5f6a7-b8c9-0123-defa-234567890123
```

**Response `200 OK`**:

```json
{
  "message": "Product deleted successfully"
}
```

---

### `GET /category/products` — Listar Produtos por Categoria

Lista todos os produtos **ativos** de uma categoria específica.

**Middlewares**: `isAuth` → `validateSchema(listProductByCategorySchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

| Param        | Tipo     | Obrigatório | Descrição           |
| ------------ | -------- | ----------- | ------------------- |
| `categoryId` | `string` | ✅           | UUID da categoria   |

**Exemplo de request**:

```
GET /category/products?categoryId=b2c3d4e5-f6a7-8901-bcde-f12345678901
```

**Response `200 OK`**:

```json
[
  {
    "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "name": "Pizza Margherita",
    "price": 4500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../pizza.jpg",
    "disabled": false,
    "categoryId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "createdAt": "2025-11-11T10:30:00.000Z",
    "category": {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Erros**:

| Status | Mensagem               | Causa                       |
| ------ | ---------------------- | --------------------------- |
| `400`  | `Category not found`   | `categoryId` inexistente    |

---

## 🧾 Pedidos (Orders)

### `POST /order` — Criar Pedido

Cria um novo pedido em modo rascunho (`draft: true`, `status: false`).

**Middlewares**: `isAuth` → `validateSchema(createOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Request Body** (`application/json`):

```json
{
  "table": 5,
  "name": "João"
}
```

| Campo   | Tipo     | Obrigatório | Regras                    |
| ------- | -------- | ----------- | ------------------------- |
| `table` | `number` | ✅           | Inteiro positivo (>= 1)   |
| `name`  | `string` | ❌           | Nome opcional do cliente  |

**Response `200 OK`**:

```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "João",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

---

### `DELETE /order` — Deletar Pedido

Remove permanentemente um pedido e todos os seus itens (cascade delete).

**Middlewares**: `isAuth` → `validateSchema(deleteOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

| Param     | Tipo     | Obrigatório | Descrição        |
| --------- | -------- | ----------- | ---------------- |
| `orderId` | `string` | ✅           | UUID do pedido   |

**Exemplo de request**:

```
DELETE /order?orderId=e5f6a7b8-c9d0-1234-efab-345678901234
```

**Response `200 OK`**:

```json
{
  "message": "Pedido deletado com sucesso!"
}
```

**Erros**:

| Status | Mensagem            | Causa                     |
| ------ | ------------------- | ------------------------- |
| `400`  | `Order not found`   | `orderId` inexistente     |

---

### `GET /orders` — Listar Pedidos

Lista pedidos com filtro opcional por status de rascunho. Por padrão retorna pedidos **não rascunhos** (enviados para cozinha).

**Middlewares**: `isAuth`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

| Param   | Tipo                  | Obrigatório | Padrão    | Descrição                            |
| ------- | --------------------- | ----------- | --------- | ------------------------------------ |
| `draft` | `"true"` \| `"false"` | ❌           | `"false"` | Filtrar por rascunho ou confirmado   |

**Exemplo de request**:

```
GET /orders
GET /orders?draft=true
```

**Response `200 OK`**:

```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "name": "João",
  "draft": false,
  "status": false,
  "createdAt": "2025-11-11T10:30:00.000Z",
  "updatedAt": "2025-11-11T11:00:00.000Z",
  "items": [
    {
      "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
      "amount": 2,
      "product": {
        "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
        "name": "Pizza Margherita",
        "price": 4500,
        "description": "Molho de tomate, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/.../pizza.jpg"
      }
    }
  ]
}
```

---

### `GET /order/detail` — Detalhes de um Pedido

Retorna todos os detalhes de um pedido específico, incluindo itens e dados dos produtos.

**Middlewares**: `isAuth` → `validateSchema(detailOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

| Param     | Tipo     | Obrigatório | Descrição        |
| --------- | -------- | ----------- | ---------------- |
| `orderId` | `string` | ✅           | UUID do pedido   |

**Exemplo de request**:

```
GET /order/detail?orderId=e5f6a7b8-c9d0-1234-efab-345678901234
```

**Response `200 OK`**:

```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "name": "João",
  "draft": true,
  "status": false,
  "createdAt": "2025-11-11T10:30:00.000Z",
  "updatedAt": "2025-11-11T10:30:00.000Z",
  "items": [
    {
      "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
      "amount": 2,
      "createdAt": "2025-11-11T10:35:00.000Z",
      "product": {
        "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
        "name": "Pizza Margherita",
        "price": 4500,
        "description": "Molho de tomate, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/.../pizza.jpg"
      }
    }
  ]
}
```

**Erros**:

| Status | Mensagem                        | Causa                |
| ------ | ------------------------------- | -------------------- |
| `400`  | `Failed to get order details`   | `orderId` inválido   |

---

## 🛒 Itens de Pedido (Order Items)

### `POST /order/add` — Adicionar Item ao Pedido

Adiciona um produto (com quantidade) a um pedido existente.

**Middlewares**: `isAuth` → `validateSchema(addItemOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Request Body** (`application/json`):

```json
{
  "orderId": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "productId": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "amount": 2
}
```

| Campo       | Tipo     | Obrigatório | Regras                    |
| ----------- | -------- | ----------- | ------------------------- |
| `orderId`   | `string` | ✅           | UUID de pedido existente  |
| `productId` | `string` | ✅           | UUID de produto ativo     |
| `amount`    | `number` | ✅           | Inteiro positivo (>= 1)   |

**Response `200 OK`**:

```json
{
  "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
  "amount": 2,
  "orderId": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "productId": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "createdAt": "2025-11-11T10:35:00.000Z",
  "product": {
    "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "name": "Pizza Margherita",
    "price": 4500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../pizza.jpg"
  }
}
```

**Erros**:

| Status | Mensagem              | Causa                                   |
| ------ | --------------------- | --------------------------------------- |
| `400`  | `Order not found`     | `orderId` inexistente                   |
| `400`  | `Product not found`   | `productId` inexistente ou desativado   |

---

### `DELETE /order/remove` — Remover Item do Pedido

Remove permanentemente um item de um pedido.

**Middlewares**: `isAuth` → `validateSchema(removeOrderItemSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

| Param    | Tipo     | Obrigatório | Descrição      |
| -------- | -------- | ----------- | -------------- |
| `itemId` | `string` | ✅           | UUID do item   |

**Exemplo de request**:

```
DELETE /order/remove?itemId=f6a7b8c9-d0e1-2345-fabc-456789012345
```

**Response `200 OK`**:

```json
{
  "message": "Item removed successfully"
}
```

**Erros**:

| Status | Mensagem           | Causa                  |
| ------ | ------------------ | ---------------------- |
| `400`  | `Item not found`   | `itemId` inexistente   |

---

## 🔄 Fluxo do Pedido

### `PUT /order/send` — Enviar Pedido para Cozinha

Confirma o pedido e o envia para a cozinha, alterando `draft: false`.

**Middlewares**: `isAuth` → `validateSchema(sendOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Request Body** (`application/json`):

```json
{
  "orderId": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "name": "João"
}
```

| Campo     | Tipo     | Obrigatório | Regras               |
| --------- | -------- | ----------- | -------------------- |
| `orderId` | `string` | ✅           | UUID do pedido       |
| `name`    | `string` | ❌           | Nome do cliente      |

**Response `200 OK`**:

```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "name": "João",
  "draft": false,
  "status": false,
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Erros**:

| Status | Mensagem            | Causa                            |
| ------ | ------------------- | -------------------------------- |
| `400`  | `Order not found`   | `orderId` ou `name` não corresponde |
| `400`  | `Failed to send order` | Falha ao atualizar              |

---

### `PUT /order/finish` — Finalizar Pedido (Cozinha)

A cozinha marca o pedido como finalizado, alterando `status: true`.

**Middlewares**: `isAuth` → `validateSchema(finishOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Request Body** (`application/json`):

```json
{
  "orderId": "e5f6a7b8-c9d0-1234-efab-345678901234"
}
```

| Campo     | Tipo     | Obrigatório | Regras          |
| --------- | -------- | ----------- | --------------- |
| `orderId` | `string` | ✅           | UUID do pedido  |

**Response `200 OK`**:

```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "name": "João",
  "draft": false,
  "status": true,
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Erros**:

| Status | Mensagem            | Causa                  |
| ------ | ------------------- | ---------------------- |
| `400`  | `Order not found`   | `orderId` inexistente  |

---

## ⚠️ Respostas de Erro Globais

### Erro de Validação de Schema (400)

```json
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no minimo 3 letras" },
    { "message": "Precisa ser um email valido" }
  ]
}
```

### Erro de Autenticação (401)

Retornado quando o token está ausente, inválido ou expirado.

```json
{
  "error": "Token invalid"
}
```

### Erro de Autorização (401)

Retornado quando o usuário não tem permissão de ADMIN.

```json
{
  "error": "Unauthorized"
}
```

### Erro de Negócio (400)

```json
{
  "error": "Mensagem do erro"
}
```

### Erro Interno (500)

```json
{
  "error": "Internal server error!"
}
```

---

## 🔄 Ciclo de Vida de um Pedido

```
[CRIAÇÃO]           POST /order          → draft: true,  status: false
[ADICIONAR ITENS]   POST /order/add      → adiciona itens ao rascunho
[REMOVER ITENS]     DELETE /order/remove → remove itens do rascunho
[ENVIAR]            PUT /order/send      → draft: false, status: false
[FINALIZAR]         PUT /order/finish    → draft: false, status: true
```

---

**Documento gerado em**: 01/03/2026  
**Versão da API**: 1.0.0
