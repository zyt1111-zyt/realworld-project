# AI 使用记录

## 概述
本项目在开发过程中使用了 Opencode AI 工具辅助开发，记录了各功能模块的AI使用情况。

## 功能模块AI使用情况

### 1. 用户注册/登录模块

**初始Prompt:**
```
请帮我实现一个Spring Boot的用户注册和登录功能，需要JWT token认证
```

**AI输出:**
- 提供了UserEntity基础结构
- 提供了JWT工具类基础代码
- 提供了Spring Security配置

**修改后Prompt:**
```
基于现有项目结构 io.zoooohs.realworld，实现用户注册登录，已有UserEntity字段：username, email, password, bio, image。需要实现：
1. Registration接口 POST /users
2. Login接口 POST /users/login
3. JWT token生成和验证
4. 使用Spring Security
```

**AI输出处理:**
- 直接使用：UserServiceImpl中的注册登录逻辑
- 修改：调整了JWT工具类以适配现有结构
- 修改原因：原AI输出使用了不同的包结构和类名

**失败案例1:**
- Prompt: `实现用户认证`
- AI输出：提供了完整的Spring Security配置，但与现有WebSecurityConfiguration冲突
- 问题：AI不了解已有安全配置，重复创建了配置类
- 解决：明确告知AI现有配置结构，让其只补充缺失部分

### 2. 文章发布模块

**Prompt:**
```
实现文章CRUD功能，实体已有ArticleEntity(slug, title, description, body, author)和CommentEntity。
需要实现：
1. 创建文章 POST /articles
2. 获取文章 GET /articles/{slug}
3. 更新文章 PUT /articles/{slug}
4. 删除文章 DELETE /articles/{slug}
5. 文章列表 GET /articles (支持tag, author, favorited过滤)
6. 文章feed GET /articles/feed
```

**AI输出处理:**
- 直接使用：ArticlesController结构
- 修改：ArticleServiceImpl中的slug生成逻辑，原AI使用UUID，改为基于标题
- 修改原因：符合RealWorld规范，slug应基于标题生成

**失败案例2:**
- Prompt: `实现文章标签功能`
- AI输出：在ArticleEntity中直接使用List<String> tagList
- 问题：不符合JPA实体设计规范，缺少中间表
- 解决：AI重新设计为ArticleTagRelationEntity关联表

### 3. 评论功能

**Prompt:**
```
实现评论功能，已有CommentEntity(article, author, body)。
需要：
1. 添加评论 POST /articles/{slug}/comments
2. 获取评论 GET /articles/{slug}/comments
3. 删除评论 DELETE /articles/{slug}/comments/{commentId}
```

**AI输出处理:**
- 直接使用：CommentService接口定义
- 修改：调整了CommentDto结构以匹配RealWorld API规范

### 4. 点赞/收藏功能

**Prompt:**
```
实现文章点赞功能，已有FavoriteEntity(article, user)。
接口：
POST /articles/{slug}/favorite - 点赞
DELETE /articles/{slug}/favorite - 取消点赞
```

**失败案例3:**
- Prompt: `实现文章点赞，返回文章详情`
- AI输出：点赞后返回简单的success消息
- 问题：不符合RealWorld API规范，应返回更新后的文章对象
- 解决：修改返回类型为ArticleDto，并重新查询文章最新状态

### 5. 前端Vue组件

**Prompt:**
```
使用Vue3 + TypeScript + Vue Router实现文章列表页面，
需要显示文章标题、描述、作者、标签、点赞数，支持分页和标签筛选
```

**AI输出处理:**
- 直接使用：HomeView.vue的整体结构
- 修改：调整了API调用方式以匹配现有api/index.ts
- 修改：添加了事件监听机制(auth-change, article-created)以实现组件间通信

## Prompt演化总结

| 阶段 | Prompt特点 | 效果 |
|------|-----------|------|
| 初始 | 简单描述需求 | AI输出过于通用，需要大量修改 |
| 改进 | 提供现有代码结构、包名、字段 | AI输出更符合项目实际 |
| 优化 | 明确接口路径、返回值格式、技术标准 | AI输出基本可直接使用 |

## AI使用成功经验

1. **提供上下文**：在Prompt中明确现有代码结构、包名、已有实体字段
2. **明确规范**：指定RealWorld API规范、返回值格式
3. **分模块开发**：每个功能模块单独请求，避免一次性请求过大功能
4. **迭代优化**：根据AI输出逐步调整Prompt，而非一次性要求完美

## AI失败案例汇总

### 案例1：安全配置冲突
- **场景**：请求实现用户认证
- **失败原因**：AI不了解已有WebSecurityConfiguration，创建了重复配置
- **解决方案**：在Prompt中明确"已有WebSecurityConfiguration类，请在此基础上补充"

### 案例2：数据模型设计不当
- **场景**：请求实现文章标签
- **失败原因**：AI直接在ArticleEntity中使用List<String>
- **解决方案**：要求AI"使用JPA规范的关联表设计"

### 案例3：API返回值不符合规范
- **场景**：请求实现点赞功能
- **失败原因**：AI返回简单消息而非文章对象
- **解决方案**：明确"按照RealWorld API规范，点赞后返回完整文章对象"

## AI工具使用统计

- 使用工具：Opencode
- 总请求次数：约25次
- 有效采用率：约80%
- 主要用途：后端Service实现、前端组件开发、DTO设计
