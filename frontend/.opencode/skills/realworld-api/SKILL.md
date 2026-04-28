---
name: realworld-api
description: RealWorld项目API调用规范，包含所有端点和请求响应格式
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  workflow: api-integration
---

## API Base URL
`https://api.realworld.show/api`

## 认证头
```
Authorization: Token <jwt_token>
```

## 端点列表

### 认证
- `POST /api/users/login` - 登录
- `POST /api/users` - 注册

### 用户
- `GET /api/user` - 获取当前用户（需认证）
- `PUT /api/user` - 更新用户（需认证）
- `GET /api/profiles/:username` - 获取资料
- `POST /api/profiles/:username/follow` - 关注
- `DELETE /api/profiles/:username/follow` - 取消关注

### 文章
- `GET /api/articles` - 文章列表（支持tag/author/favorited/limit/offset）
- `GET /api/articles/feed` - 关注者文章（需认证）
- `GET /api/articles/:slug` - 单篇文章
- `POST /api/articles` - 创建文章（需认证）
- `PUT /api/articles/:slug` - 更新文章（需认证）
- `DELETE /api/articles/:slug` - 删除文章（需认证）
- `POST /api/articles/:slug/favorite` - 收藏
- `DELETE /api/articles/:slug/favorite` - 取消收藏

### 评论
- `GET /api/articles/:slug/comments` - 评论列表
- `POST /api/articles/:slug/comments` - 添加评论（需认证）
- `DELETE /api/articles/:slug/comments/:id` - 删除评论（需认证）

### 标签
- `GET /api/tags` - 获取所有标签

## 请求格式示例

### 登录
```json
{ "user": { "email": "xxx", "password": "xxx" } }
```

### 注册
```json
{ "user": { "username": "xxx", "email": "xxx", "password": "xxx" } }
```

### 创建文章
```json
{ "article": { "title": "xxx", "description": "xxx", "body": "xxx", "tagList": ["react", "vue"] } }
```

### 添加评论
```json
{ "comment": { "body": "xxx" } }
```

## 响应格式

### User (认证)
```json
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": null,
    "image": null
  }
}
```

### Profile
```json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://i.stack.imgur.com/xHWG8.jpg",
    "following": false
  }
}
```

### Single Article
```json
{
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```

### Multiple Articles (列表不带body)
```json
{
  "articles": [{
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": { "username": "jake", "bio": "...", "image": "...", "following": false }
  }],
  "articlesCount": 2
}
```

### Single Comment
```json
{
  "comment": {
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```

### Multiple Comments
```json
{
  "comments": [{
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": { "username": "jake", "bio": "...", "image": "...", "following": false }
  }]
}
```

### Tags
```json
{ "tags": ["reactjs", "angularjs"] }
```
