# 个人作品集与博客 API

这是一个为个人作品集网站提供后端支持的、功能齐全的 RESTful API。它使用 Node.js、Express 和 MongoDB 构建，并实现了完整的用户认证（JWT）和授权系统。此 API 能够管理作品集项目、博客文章、评论以及访客留言。

---

## ✨ 主要功能

- **MVC 架构：** 清晰的项目结构，易于维护和扩展。
- **CRUD 操作：** 为所有核心资源（用户、项目、博客、评论）提供完整的增删改查接口。
- **用户认证：** 使用 JWT (JSON Web Tokens) 实现用户注册和登录，确保 API 安全。
- **授权系统：** 精确的权限控制，确保用户只能修改自己的内容（例如，博客文章）。
- **数据关联：** 使用 Mongoose `populate` 实现模型间的复杂数据查询（如文章及其所有评论）。
- **密码安全：** 使用 `bcrypt.js` 对用户密码进行安全的哈希处理。
- **安全配置：** 使用 `helmet` 设置安全 HTTP 头，防止常见 Web 漏洞。
- **环境变量：** 使用 `dotenv` 集中管理所有敏感配置信息。
- **健壮的错误处理：** 集中式的错误处理中间件，提供一致的 JSON 错误响应。

---

## 🛠️ 技术栈

- **后端框架:** Express.js
- **数据库:** MongoDB (云端使用 MongoDB Atlas)
- **ODM (对象数据建模):** Mongoose
- **认证:** JSON Web Tokens (`jsonwebtoken`)
- **密码哈希:** `bcrypt.js`
- **安全中间件:** `helmet`
- **环境变量管理:** `dotenv`
- **CORS 处理:** `cors`



## 🚀 本地运行指南

### 1. 先决条件

- [Node.js](https://nodejs.org/) (建议使用 v18 或更高版本)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 账户或本地 MongoDB 实例

### 2. 环境变量

在项目根目录下创建一个名为 `.env` 的文件，并添加以下变量。请将值替换为您自己的配置。

env
# 你的 MongoDB Atlas 连接字符串
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/myPortfolioDB?retryWrites=true&w=majority

# 用于签发 JWT 的密钥（可以是一个长而随机的字符串）
JWT_SECRET=your_super_secret_jwt_key_here

# 服务器运行的端口
PORT=5000

# 运行环境 (development 或 production)
NODE_ENV=development
3. 安装与启动
code
Bash
# 1. 克隆此仓库
git clone https://github.com/yes670/capstone-api.git

# 2. 进入项目目录
cd capstone-api

# 3. 安装项目依赖
npm install

# 4. 启动开发服务器 (使用 nodemon，代码更改后会自动重启)
npm run dev

# 5. 启动生产服务器
npm start
服务器启动后，API 将在 http://localhost:5000 上可用。
## 📚 API 端点文档

以下是所有可用的 API 端点。

**注意:**
- 标记为 `🔒 Protected` 的端点需要在请求的 `Authorization` 头中包含一个有效的 Bearer Token (`Bearer <your_token>`)。
- 标记为 `🔒 Authorized` 的端点不仅需要认证，还需要用户拥有特定权限（例如，是资源的所有者）。

### 用户认证 (Authentication)

| 方法   | 路径                   | 描述                 | 访问权限 | 请求体 (Body)                                                          |
| :----- | :--------------------- | :------------------- | :------- | :--------------------------------------------------------------------- |
| `POST` | `/api/users/register`  | 注册一个新用户       | Public   | `{ "username": "newUser", "email": "new@email.com", "password": "123456" }` |
| `POST` | `/api/users/login`     | 用户登录并获取 Token | Public   | `{ "email": "new@email.com", "password": "123456" }`                     |

### 作品集项目 (Projects)

| 方法     | 路径                 | 描述                 | 访问权限   | 请求体 (Body)                                             |
| :------- | :------------------- | :------------------- | :--------- | :-------------------------------------------------------- |
| `GET`    | `/api/projects`      | 获取所有项目         | Public     | N/A                                                       |
| `GET`    | `/api/projects/:id`  | 获取单个项目         | Public     | N/A                                                       |
| `POST`   | `/api/projects`      | 创建一个新项目       | 🔒 Protected | `{ "title": "...", "description": "...", "repoUrl": "..." }` |
| `PUT`    | `/api/projects/:id`  | 更新一个项目         | 🔒 Protected | `{ "title": "..." }` (或其他可选字段)                      |
| `DELETE` | `/api/projects/:id`  | 删除一个项目         | 🔒 Protected | N/A                                                       |

### 博客文章 (Blog Posts)

| 方法     | 路径                 | 描述                             | 访问权限           | 请求体 (Body)                                     |
| :------- | :------------------- | :------------------------------- | :----------------- | :------------------------------------------------ |
| `GET`    | `/api/blog`          | 获取所有博客文章                 | Public             | N/A                                               |
| `GET`    | `/api/blog/:id`      | 获取单篇文章（包含作者和评论）   | Public             | N/A                                               |
| `POST`   | `/api/blog`          | 创建一篇新文章                   | 🔒 Protected       | `{ "title": "...", "content": "..." }`            |
| `PUT`    | `/api/blog/:id`      | 更新文章（仅限作者）             | 🔒 Authorized      | `{ "title": "..." }` (或 content)                 |
| `DELETE` | `/api/blog/:id`      | 删除文章（仅限作者）             | 🔒 Authorized      | N/A                                               |

### 评论 (Comments)

| 方法   | 路径                         | 描述             | 访问权限   | 请求体 (Body)          |
| :----- | :--------------------------- | :--------------- | :--------- | :--------------------- |
| `POST` | `/api/blog/:postId/comments` | 为文章添加新评论   | 🔒 Protected | `{ "body": "..." }`      |
| `GET`  | `/api/blog/:postId/comments` | 获取文章的所有评论 | Public     | N/A                    |


### 联系信息 (Contact)

| 方法   | 路径            | 描述               | 访问权限 | 请求体 (Body)                                                         |
| :----- | :-------------- | :----------------- | :------- | :-------------------------------------------------------------------- |
| `POST` | `/api/contact`  | 提交联系表单信息   | Public   | `{ "name": "Visitor Name", "email": "visitor@email.com", "message": "..." }` |
