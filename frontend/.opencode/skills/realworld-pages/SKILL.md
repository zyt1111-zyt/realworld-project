---
name: realworld-pages
description: RealWorld项目页面组件规范，包含各页面HTML结构和模板
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  workflow: frontend-development
---

## 页面组件文件

| 页面 | 路由 | 文件路径 |
|------|------|----------|
| 首页 | `/` | `src/views/HomeView.vue` |
| 登录页 | `/login` | `src/views/LoginView.vue` |
| 注册页 | `/register` | `src/views/RegisterView.vue` |
| 设置页 | `/settings` | `src/views/SettingsView.vue` |
| 文章编辑页 | `/editor`, `/editor/:slug` | `src/views/EditorView.vue` |
| 文章详情页 | `/article/:slug` | `src/views/ArticleView.vue` |
| 用户资料页 | `/profile/:username`, `/profile/:username/favorites` | `src/views/ProfileView.vue` |

## 页面列表

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

## Header组件

### 未登录
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

### 已登录
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

## Footer组件
```html
<footer>
  <div class="container">
    <a href="/" class="logo-font">conduit</a>
    <span class="attribution">An interactive learning project.</span>
  </div>
</footer>
```

## 登录页 `/login`
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

## 注册页 `/register`
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

## 设置页 `/settings`
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

## 文章详情页 `/article/:slug`
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

## 用户资料页 `/profile/:username`
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
