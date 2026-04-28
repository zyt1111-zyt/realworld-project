---
name: realworld-complete
description: RealWorld项目完整开发规范，涵盖页面组件、认证、API、状态管理、路由等
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  workflow: frontend-development
---

# RealWorld 项目开发规范

## 项目技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router

## 项目结构

```
src/
├── api/           # API请求封装
├── components/   # 公共组件
├── router/       # 路由配置
├── stores/       # Pinia状态管理
├── views/        # 页面组件
├── App.vue
└── main.ts
```

---

## 1. 路由配置

### 路由列表
```typescript
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/settings', name: 'settings', component: Settings },
  { path: '/editor', name: 'editor-create', component: Editor },
  { path: '/editor/:slug', name: 'editor-edit', component: Editor },
  { path: '/article/:slug', name: 'article', component: Article },
  { path: '/profile/:username', name: 'profile', component: Profile },
  { path: '/profile/:username/favorites', name: 'profile-favorites', component: Profile },
]
```

### 路由守卫
需要认证的路由：`/settings`, `/editor`, `/editor/:slug`
```typescript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})
```

### 路由名称规范
- home, login, register, settings
- editor-create, editor-edit
- article, profile, profile-favorites

---

## 2. API 调用规范

### Base URL
`https://api.realworld.show/api`

### 认证头
```
Authorization: Token <jwt_token>
```

### API 端点

#### 认证
- `POST /api/users/login` - 登录
- `POST /api/users` - 注册

#### 用户
- `GET /api/user` - 获取当前用户（需认证）
- `PUT /api/user` - 更新用户（需认证）
- `GET /api/profiles/:username` - 获取资料
- `POST /api/profiles/:username/follow` - 关注
- `DELETE /api/profiles/:username/follow` - 取消关注

#### 文章
- `GET /api/articles` - 文章列表（支持tag/author/favorited/limit/offset）
- `GET /api/articles/feed` - 关注者文章（需认证）
- `GET /api/articles/:slug` - 单篇文章
- `POST /api/articles` - 创建文章（需认证）
- `PUT /api/articles/:slug` - 更新文章（需认证）
- `DELETE /api/articles/:slug` - 删除文章（需认证）
- `POST /api/articles/:slug/favorite` - 收藏
- `DELETE /api/articles/:slug/favorite` - 取消收藏

#### 评论
- `GET /api/articles/:slug/comments` - 评论列表
- `POST /api/articles/:slug/comments` - 添加评论（需认证）
- `DELETE /api/articles/:slug/comments/:id` - 删除评论（需认证）

#### 标签
- `GET /api/tags` - 获取所有标签

### 请求格式示例

```json
// 登录
{ "user": { "email": "xxx", "password": "xxx" } }

// 注册
{ "user": { "username": "xxx", "email": "xxx", "password": "xxx" } }

// 创建文章
{ "article": { "title": "xxx", "description": "xxx", "body": "xxx", "tagList": ["react", "vue"] } }

// 添加评论
{ "comment": { "body": "xxx" } }
```

### 响应格式

#### User (认证)
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

#### Single Article
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

#### Multiple Articles (列表不带body)
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

#### Profile
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

#### Tags
```json
{ "tags": ["reactjs", "angularjs"] }
```

---

## 3. 认证流程

### 登录流程
1. 调用 `POST /api/users/login`，body: `{ "user": { "email", "password" } }`
2. 成功后返回 `{ user: { token, email, username, bio, image } }`
3. 存储 token: `localStorage.setItem('token', user.token)`
4. 存储用户: `localStorage.setItem('user', JSON.stringify(user))`

### 注册流程
1. 调用 `POST /api/users`，body: `{ "user": { "username", "email", "password" } }`
2. 成功后返回 token
3. 存储 token 和用户信息

### 发送认证请求
```typescript
const token = localStorage.getItem('token')
fetch(url, {
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 退出登录
```typescript
localStorage.removeItem('token')
localStorage.removeItem('user')
```

### User 数据结构
```typescript
interface User {
  email: string
  username: string
  bio: string | null
  image: string | null
  token: string
}
```

---

## 4. Pinia 状态管理

### authStore - 用户认证
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface User {
  email: string
  username: string
  bio: string
  image: string
}
```
核心方法：`login()`, `register()`, `logout()`, `fetchCurrentUser()`

### articlesStore - 文章管理
```typescript
interface Article {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  author: Profile
  favorited: boolean
  favoritesCount: number
  createdAt: string
  updatedAt: string
}
```
核心方法：`fetchArticles()`, `fetchFeedArticles()`, `fetchArticle()`, `createArticle()`, `updateArticle()`, `deleteArticle()`, `favoriteArticle()`, `unfavoriteArticle()`

### commentsStore - 评论管理
```typescript
interface Comment {
  id: number
  body: string
  author: Profile
  createdAt: string
}
```
核心方法：`fetchComments()`, `addComment()`, `deleteComment()`

### profileStore - 用户资料
```typescript
interface Profile {
  username: string
  bio: string
  image: string
  following: boolean
}
```
核心方法：`fetchProfile()`, `followUser()`, `unfollowUser()`

### tagsStore - 标签管理
核心方法：`fetchTags()`, `selectTag()`, `clearTag()`

---

## 5. 页面组件

### 页面文件对照表

| 页面 | 路由 | 文件路径 |
|------|------|----------|
| 首页 | `/` | `src/views/HomeView.vue` |
| 登录页 | `/login` | `src/views/LoginView.vue` |
| 注册页 | `/register` | `src/views/RegisterView.vue` |
| 设置页 | `/settings` | `src/views/SettingsView.vue` |
| 文章编辑页 | `/editor`, `/editor/:slug` | `src/views/EditorView.vue` |
| 文章详情页 | `/article/:slug` | `src/views/ArticleView.vue` |
| 用户资料页 | `/profile/:username`, `/profile/:username/favorites` | `src/views/ProfileView.vue` |

### 首页 `/`
- Banner区域：显示项目logo和标语
- 文章列表：支持Your Feed / Global Feed / Tag切换
- 侧边栏：Popular Tags
- 分页组件

### 登录页 `/login`
- 邮箱/密码输入框
- 错误提示区域
- 跳转到注册链接

### 注册页 `/register`
- 用户名/邮箱/密码输入框
- 错误提示区域
- 跳转到登录链接

### 设置页 `/settings`
- 头像URL输入框
- 用户名输入框
- 个人简介文本域
- 邮箱输入框
- 新密码输入框
- 更新按钮
- 退出登录按钮

### 文章编辑页 `/editor`, `/editor/:slug`
- 标题输入框
- 文章简介输入框
- 正文文本域（支持Markdown）
- 标签输入框
- 发布按钮

### 文章详情页 `/article/:slug`
- Banner区域：标题、作者信息
- 文章正文（Markdown渲染）
- 标签列表
- 底部操作栏：关注/收藏/编辑/删除
- 评论区域：评论列表 + 添加评论表单

### 用户资料页 `/profile/:username`
- 用户信息区：头像、用户名、简介、关注按钮
- 标签切换：My Articles / Favorited Articles
- 文章列表
- 分页组件

---

## 6. 组件模板

### Header组件 - 未登录
```html
<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href="/">conduit</a>
    <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item"><a class="nav-link active" href="/">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="/login">Sign in</a></li>
      <li class="nav-item"><a class="nav-link" href="/register">Sign up</a></li>
    </ul>
  </div>
</nav>
```

### Header组件 - 已登录
```html
<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href="/">conduit</a>
    <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="/editor"><i class="ion-compose"></i>&nbsp;New Article</a></li>
      <li class="nav-item"><a class="nav-link" href="/settings"><i class="ion-gear-a"></i>&nbsp;Settings</a></li>
      <li class="nav-item">
        <a class="nav-link" href="/profile/username">
          <img :src="user.image" class="user-pic" />
          {{ user.username }}
        </a>
      </li>
    </ul>
  </div>
</nav>
```

### Footer组件
```html
<footer>
  <div class="container">
    <a href="/" class="logo-font">conduit</a>
    <span class="attribution">An interactive learning project.</span>
  </div>
</footer>
```

### 登录页模板
```html
<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center"><a href="/register">Need an account?</a></p>
        <ul class="error-messages"><li>Error message</li></ul>
        <form @submit.prevent="login">
          <fieldset class="form-group">
            <input v-model="email" class="form-control form-control-lg" type="text" placeholder="Email" />
          </fieldset>
          <fieldset class="form-group">
            <input v-model="password" class="form-control form-control-lg" type="password" placeholder="Password" />
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">Sign in</button>
        </form>
      </div>
    </div>
  </div>
</div>
```

### 注册页模板
```html
<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center"><a href="/login">Have an account?</a></p>
        <form>
          <fieldset class="form-group">
            <input v-model="username" class="form-control form-control-lg" type="text" placeholder="Username" />
          </fieldset>
          <fieldset class="form-group">
            <input v-model="email" class="form-control form-control-lg" type="text" placeholder="Email" />
          </fieldset>
          <fieldset class="form-group">
            <input v-model="password" class="form-control form-control-lg" type="password" placeholder="Password" />
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">Sign up</button>
        </form>
      </div>
    </div>
  </div>
</div>
```

### 设置页模板
```html
<div class="settings-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>
        <form>
          <fieldset class="form-group">
            <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture" />
          </fieldset>
          <fieldset class="form-group">
            <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name" />
          </fieldset>
          <fieldset class="form-group">
            <textarea v-model="user.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
          </fieldset>
          <fieldset class="form-group">
            <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email" />
          </fieldset>
          <fieldset class="form-group">
            <input v-model="password" class="form-control form-control-lg" type="password" placeholder="New Password" />
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
        </form>
        <hr />
        <button @click="logout" class="btn btn-outline-danger">Or click here to logout.</button>
      </div>
    </div>
  </div>
</div>
```

### 文章详情页模板
```html
<div class="article-page">
  <div class="banner">
    <div class="container">
      <h1>{{ article.title }}</h1>
      <div class="article-meta">
        <a :href="`/profile/${article.author.username}`">
          <img :src="article.author.image" />
        </a>
        <div class="info">
          <a :href="`/profile/${article.author.username}`" class="author">{{ article.author.username }}</a>
          <span class="date">{{ article.createdAt }}</span>
        </div>
        <button v-if="!isAuthor" class="btn btn-sm btn-outline-secondary">
          <i class="ion-plus-round"></i> Follow {{ article.author.username }}
        </button>
        <button v-if="!isAuthor" class="btn btn-sm btn-outline-primary">
          <i class="ion-heart"></i> Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
        </button>
        <span v-if="isAuthor">
          <a :href="`/editor/${article.slug}`" class="btn btn-sm btn-outline-secondary"><i class="ion-edit"></i> Edit Article</a>
          <button @click="deleteArticle" class="btn btn-sm btn-outline-danger"><i class="ion-trash-a"></i> Delete Article</button>
        </span>
      </div>
    </div>
  </div>
  <div class="container page">
    <div class="row article-content">
      <div class="col-md-12">
        <p>{{ article.body }}</p>
        <ul class="tag-list">
          <li v-for="tag in article.tagList" class="tag-default tag-pill tag-outline">{{ tag }}</li>
        </ul>
      </div>
    </div>
    <hr />
    <!-- 评论区域 -->
    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form v-if="isAuthenticated" class="card comment-form" @submit.prevent="addComment">
          <div class="card-block">
            <textarea v-model="newComment" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img :src="currentUser.image" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
          </div>
        </form>
        <div v-for="comment in comments" class="card">
          <div class="card-block"><p class="card-text">{{ comment.body }}</p></div>
          <div class="card-footer">
            <a :href="`/profile/${comment.author.username}`" class="comment-author">
              <img :src="comment.author.image" class="comment-author-img" />
            </a>
            <a :href="`/profile/${comment.author.username}`" class="comment-author">{{ comment.author.username }}</a>
            <span class="date-posted">{{ comment.createdAt }}</span>
            <span v-if="isCommentAuthor(comment)" class="mod-options">
              <i @click="deleteComment(comment.id)" class="ion-trash-a"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 用户资料页模板
```html
<div class="profile-page">
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" />
          <h4>{{ profile.username }}</h4>
          <p>{{ profile.bio }}</p>
          <button v-if="!isCurrentUser && !profile.following" @click="follow" class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-plus-round"></i> Follow {{ profile.username }}
          </button>
          <button v-if="!isCurrentUser && profile.following" @click="unfollow" class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-minus-round"></i> Unfollow {{ profile.username }}
          </button>
          <a v-if="isCurrentUser" href="/settings" class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-gear-a"></i> Edit Profile Settings
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a :class="{ active: !favorites }" :href="`/profile/${username}`">My Articles</a>
            </li>
            <li class="nav-item">
              <a :class="{ active: favorites }" :href="`/profile/${username}/favorites`">Favorited Articles</a>
            </li>
          </ul>
        </div>
        <!-- 文章列表 -->
      </div>
    </div>
  </div>
</div>
```

---

## 7. CSS 样式

### 主样式 (必须)
```html
<link rel="stylesheet" href="https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/theme/styles.css" />
```

### 图标字体
```html
<link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" />
```

### 字体
```html
<link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700" rel="stylesheet" />
```

### 默认头像
```html
<img src="https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg" alt="Default Avatar" />
```

---

## 8. API 封装示例

```typescript
// api/index.ts
const API_BASE = 'https://api.realworld.show/api'

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Token ${token}` }),
    ...options.headers
  }
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw error
  }
  
  return res.json()
}
```
