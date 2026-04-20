# RealWorld Conduit - 前后端分离博客系统

基于RealWorld规范的博客系统，使用AI辅助开发完成。

## 项目介绍

这是一个功能完整的博客系统（Conduit），支持用户注册登录、文章发布、评论、点赞、关注等功能。

### 实现功能
- ✅ 用户注册/登录（JWT认证）
- ✅ 文章发布/编辑/删除
- ✅ 文章评论
- ✅ 文章点赞/收藏
- ✅ 用户关注/取消关注
- ✅ 标签筛选文章
- ✅ 个人资料展示
- ✅ 文章Feed流

## 技术选型

### 后端
- **Spring Boot 2.6.7** - Java后端框架
- **Spring Data JPA** - ORM框架
- **H2 Database** - 内存数据库（可切换到MariaDB）
- **Spring Security** - 安全框架
- **JWT (JJWT)** - 无状态认证
- **Lombok** - 减少样板代码
- **Java 17**

### 前端
- **Vue 3.5** - 渐进式JavaScript框架
- **TypeScript 5.9** - 类型安全
- **Vite 7.3** - 快速构建工具
- **Vue Router 5.0** - 路由管理
- **Pinia 3.0** - 状态管理

## 项目结构

```
realworld-project/
├── backend/                # Spring Boot后端
│   ├── src/main/java/...  # 主要代码
│   ├── build.gradle       # Gradle配置
│   └── data/              # H2数据库文件（运行时生成）
├── frontend/               # Vue3前端
│   ├── src/               # 源代码
│   │   ├── api/           # API接口
│   │   ├── views/         # 页面组件
│   │   ├── router/        # 路由配置
│   │   └── assets/        # 静态资源
│   └── package.json       # npm配置
├── docs/                   # 文档
│   ├── ai-usage.md        # AI使用记录
│   └── architecture.md    # 项目架构说明
└── README.md               # 本文件
```

## 项目运行步骤

### 前提条件
- JDK 17+
- Node.js 20.19+ 或 22.12+
- npm 或 pnpm

### 1. 启动后端

```bash
cd backend
.\gradlew.bat bootRun
```

后端将在 `http://localhost:8080` 启动。

### 2. 启动前端

```bash
cd frontend
npm install    # 第一次需要安装依赖
npm run dev
```

前端将在 `http://localhost:5173` 启动。

### 3. 访问应用

打开浏览器访问 `http://localhost:5173`

### 数据库

默认使用H2内存数据库，无需额外配置。如需使用MariaDB，请修改 `backend/src/main/resources/application.properties`。

## API接口说明

### 用户相关
- `POST /users` - 用户注册
- `POST /users/login` - 用户登录
- `GET /user` - 获取当前用户信息
- `PUT /user` - 更新用户信息

### 文章相关
- `GET /articles` - 获取文章列表（支持tag、author、favorited过滤）
- `GET /articles/feed` - 获取关注用户的文章
- `GET /articles/{slug}` - 获取文章详情
- `POST /articles` - 创建文章
- `PUT /articles/{slug}` - 更新文章
- `DELETE /articles/{slug}` - 删除文章
- `POST /articles/{slug}/favorite` - 点赞文章
- `DELETE /articles/{slug}/favorite` - 取消点赞

### 评论相关
- `GET /articles/{slug}/comments` - 获取评论列表
- `POST /articles/{slug}/comments` - 添加评论
- `DELETE /articles/{slug}/comments/{commentId}` - 删除评论

### 用户资料相关
- `GET /profiles/{username}` - 获取用户资料
- `POST /profiles/{username}/follow` - 关注用户
- `DELETE /profiles/{username}/follow` - 取消关注

### 标签
- `GET /tags` - 获取所有标签

## AI使用总结

本项目使用 **Opencode AI** 辅助开发，详细使用记录见 [docs/ai-usage.md](docs/ai-usage.md)。

### 成功经验
1. **提供上下文**：在Prompt中明确现有代码结构、包名、已有实体字段
2. **明确规范**：指定RealWorld API规范、返回值格式
3. **分模块开发**：每个功能模块单独请求，避免一次性请求过大功能
4. **迭代优化**：根据AI输出逐步调整Prompt

### 失败案例（至少3个）
1. **安全配置冲突**：AI不了解已有WebSecurityConfiguration，创建了重复配置
   - 解决：在Prompt中明确已有配置结构
   
2. **数据模型设计不当**：AI直接在ArticleEntity中使用List<String>存储标签
   - 解决：要求AI使用JPA规范的关联表设计
   
3. **API返回值不符合规范**：AI点赞后返回简单消息而非文章对象
   - 解决：明确按照RealWorld API规范，点赞后返回完整文章对象

详细失败案例和Prompt演化过程见 [docs/ai-usage.md](docs/ai-usage.md)。

## Git提交记录

### 提交历史（按时间顺序）
1. `feat: 初始化项目结构` - 创建backend和frontend基础框架
2. `feat: 实现用户注册功能` - User模块基础实现
3. `feat: 实现用户登录和JWT认证` - Spring Security + JWT
4. `feat: 实现文章CRUD功能` - Article模块
5. `feat: 实现文章评论功能` - Comment模块
6. `feat: 实现文章点赞功能` - Favorite功能
7. `feat: 实现用户关注功能` - Profile模块
8. `feat: 实现标签功能` - Tag模块
9. `feat: 完成前端登录注册页面` - LoginView, RegisterView
10. `feat: 完成前端首页文章列表` - HomeView
11. `feat: 完成前端文章详情和评论` - ArticleView
12. `feat: 完成前端文章编辑器` - EditorView
13. `feat: 完成前端用户资料和设置` - ProfileView, SettingsView
14. `docs: 添加AI使用记录` - docs/ai-usage.md
15. `docs: 添加项目架构说明` - docs/architecture.md
16. `docs: 完善README和运行说明` - README.md
17. `fix: 修复前后端交互问题` - 调整API调用和错误处理
18. `refactor: 优化代码结构和错误处理` - 代码清理

每个提交都包含：
- [类型] feat / fix / refactor / test / docs
- [任务描述] 本次完成内容
- [实现思路] 为什么这样设计
- [AI参与情况] 是否使用AI + 工具 + 核心Prompt
- [Prompt演化过程] 初始Prompt / 修改后Prompt / 修改原因
- [AI输出处理] 是否直接使用？做了哪些修改？
- [问题与反思] 遇到的问题与解决方式

## 开发环境

- **操作系统**: Windows 10/11
- **JDK**: 11.0.x
- **Node.js**: 20.19+ 或 22.12+
- **npm**: 对应Node.js版本
- **IDE**: VS Code / IntelliJ IDEA (推荐)

## 注意事项

1. 后端默认使用H2内存数据库，重启后数据会丢失
2. 如需持久化，请配置MariaDB或使用H2文件模式
3. JWT密钥在JwtUtils.java中配置，生产环境请修改
4. 前端API基础路径在 `frontend/src/api/index.ts` 中配置

## 测试账号

启动应用后，可以通过以下方式测试：
1. 注册新用户
2. 或使用已有用户（如果数据库有数据）

## 开发规范

### 代码规范
- 后端使用Java 11规范，使用Lombok减少样板代码
- 前端使用TypeScript，遵循Vue3风格指南

### 提交规范
```
[类型] 简短描述

[详细描述]

[AI参与情况]
```

类型：feat / fix / refactor / test / docs

## 贡献者

- 开发者：[邹宇婷]
- AI工具：Opencode
- 项目日期：2026年4月

## 许可证

本项目基于MIT许可证开源。
