# 项目架构说明

## 项目概述
本项目是基于RealWorld规范的博客系统（Conduit），采用前后端分离架构。

## 技术选型及原因

### 后端技术栈
- **Spring Boot 2.6.7**：快速开发框架，自动配置，内嵌服务器
- **Spring Data JPA**：ORM框架，简化数据库操作
- **H2 Database**：内存数据库，开发测试方便（也可配置MariaDB）
- **Spring Security**：安全框架，处理认证授权
- **JWT (JJWT 0.11.4)**：无状态认证，适合前后端分离
- **Lombok**：减少样板代码
- **Java 11**：长期支持版本

**选型原因：**
- Spring生态成熟，社区活跃，文档丰富
- JPA适合快速开发，减少SQL编写
- JWT适合前后端分离场景，无需session
- H2方便开发测试，可无缝切换到MariaDB

### 前端技术栈
- **Vue 3.5.29**：渐进式框架，响应式数据绑定
- **TypeScript 5.9.3**：类型安全，开发体验好
- **Vite 7.3.1**：快速构建工具，开发体验优秀
- **Vue Router 5.0.3**：路由管理
- **Pinia 3.0.4**：状态管理（已引入但未大量使用）

**选型原因：**
- Vue3 + TypeScript 提供良好的开发体验和类型安全
- Vite 构建速度快，支持热更新
- 符合现代前端开发趋势

## 项目结构

```
realworld-project/
├── backend/                        # 后端Spring Boot项目
│   ├── src/main/java/io/zoooohs/realworld/
│   │   ├── configuration/          # 配置类
│   │   ├── domain/                 # 领域模型
│   │   │   ├── article/            # 文章模块
│   │   │   │   ├── controller/     # 文章控制器
│   │   │   │   ├── dto/            # 数据传输对象
│   │   │   │   ├── entity/         # 文章实体
│   │   │   │   ├── model/          # 查询参数模型
│   │   │   │   ├── repository/     # 数据访问层
│   │   │   │   └── servie/         # 服务层（注意：拼写错误，应为service）
│   │   │   ├── common/             # 公共模块
│   │   │   │   └── entity/         # 基础实体(BaseEntity)
│   │   │   ├── profile/            # 用户资料模块
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   ├── tag/                # 标签模块
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   └── user/               # 用户模块
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── entity/
│   │   │       ├── repository/
│   │   │       └── service/
│   │   ├── exception/              # 异常处理
│   │   └── security/               # 安全相关
│   │       ├── AuthUserDetails.java
│   │       ├── JWTAuthFilter.java
│   │       ├── JwtUtils.java
│   │       └── WebSecurityConfiguration.java
│   └── build.gradle                # Gradle构建配置
│
├── frontend/                       # 前端Vue项目
│   ├── src/
│   │   ├── api/                    # API接口定义
│   │   │   └── index.ts            # API调用封装
│   │   ├── assets/                 # 静态资源
│   │   │   └── styles.css          # 全局样式
│   │   ├── router/                 # 路由配置
│   │   │   └── index.ts
│   │   └── views/                  # 页面组件
│   │       ├── ArticleView.vue     # 文章详情页
│   │       ├── EditorView.vue      # 文章编辑页
│   │       ├── HomeView.vue        # 首页
│   │       ├── LoginView.vue       # 登录页
│   │       ├── ProfileView.vue     # 用户资料页
│   │       ├── RegisterView.vue    # 注册页
│   │       └── SettingsView.vue    # 设置页
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                           # 文档目录
│   ├── ai-usage.md                 # AI使用记录
│   └── architecture.md             # 项目架构说明
│
├── README.md                        # 项目说明文件
└── .gitignore                       # Git忽略文件
```

## 模块划分

### 后端模块

1. **用户模块 (user)**
   - 功能：注册、登录、获取/更新用户信息
   - 接口：
     - POST /users - 注册
     - POST /users/login - 登录
     - GET /user - 获取当前用户
     - PUT /user - 更新用户信息

2. **文章模块 (article)**
   - 功能：文章CRUD、文章列表、文章feed、点赞/取消点赞
   - 接口：
     - GET /articles - 文章列表
     - GET /articles/feed - 关注用户文章
     - GET /articles/{slug} - 获取文章
     - POST /articles - 创建文章
     - PUT /articles/{slug} - 更新文章
     - DELETE /articles/{slug} - 删除文章
     - POST /articles/{slug}/favorite - 点赞
     - DELETE /articles/{slug}/favorite - 取消点赞

3. **评论模块 (comment)**
   - 功能：添加评论、获取评论列表、删除评论
   - 接口：
     - GET /articles/{slug}/comments - 获取评论
     - POST /articles/{slug}/comments - 添加评论
     - DELETE /articles/{slug}/comments/{commentId} - 删除评论

4. **标签模块 (tag)**
   - 功能：获取所有标签
   - 接口：
     - GET /tags - 标签列表

5. **用户资料模块 (profile)**
   - 功能：获取用户资料、关注/取消关注
   - 接口：
     - GET /profiles/{username} - 获取用户资料
     - POST /profiles/{username}/follow - 关注
     - DELETE /profiles/{username}/follow - 取消关注

### 前端模块

1. **认证相关页面**
   - LoginView.vue - 登录
   - RegisterView.vue - 注册

2. **文章相关页面**
   - HomeView.vue - 首页（文章列表）
   - ArticleView.vue - 文章详情
   - EditorView.vue - 创建/编辑文章

3. **用户相关页面**
   - ProfileView.vue - 用户资料
   - SettingsView.vue - 用户设置

## 前后端交互方式

### API规范
遵循RealWorld API规范，所有接口返回JSON格式。

### 认证方式
- 使用JWT Token认证
- Token放在HTTP Header中：`Authorization: Token jwt-token-here`
- 前端将token存储在localStorage

### 数据流转
```
前端(Vue组件) → API调用(api/index.ts) → 后端Controller → Service → Repository → Database
                                      ↓
前端(Vue组件) ← JSON响应 ← Controller ← Service处理结果
```

### 跨域处理
后端已配置CORS，允许前端localhost:5173访问。

### 错误处理
- 后端抛出AppException，统一异常处理返回错误JSON
- 前端捕获错误并显示在页面上

## 数据库设计

### 核心实体关系
```
UserEntity (用户)
  ├── 一对多 → ArticleEntity (文章)
  ├── 一对多 → CommentEntity (评论)
  ├── 一对多 → FavoriteEntity (点赞)
  └── 一对多 → FollowEntity (关注)

ArticleEntity (文章)
  ├── 多对一 → UserEntity (作者)
  ├── 一对多 → CommentEntity (评论)
  ├── 一对多 → FavoriteEntity (点赞)
  └── 一对多 → ArticleTagRelationEntity (标签关联)

ArticleTagRelationEntity (文章标签关联)
  ├── 多对一 → ArticleEntity
  └── 字段: tag (标签名)
```

## 配置说明

### 后端配置
- 默认使用H2内存数据库
- 可通过application.properties配置MariaDB
- JWT密钥配置在JwtUtils中

### 前端配置
- API基础路径：`http://localhost:8080`
- 开发服务器端口：5173
- 需要后端运行在8080端口

## 待改进点

1. **后端servie目录拼写错误**：应为service
2. **前端状态管理**：可更多使用Pinia进行状态管理
3. **错误处理**：可进一步完善错误提示
4. **测试**：缺少单元测试和集成测试
5. **分页**：文章列表分页可优化
