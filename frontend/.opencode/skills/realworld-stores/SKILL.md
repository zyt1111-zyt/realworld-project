---
name: realworld-stores
description: RealWorld项目Pinia状态管理规范
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  workflow: state-management
---

## Store结构

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

核心方法：
- `login(email, password)`
- `register(username, email, password)`
- `logout()`
- `fetchCurrentUser()`

### articlesStore - 文章管理
```typescript
interface ArticlesState {
  articles: Article[]
  articlesCount: number
  currentArticle: Article | null
  feedArticles: Article[]
}

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

核心方法：
- `fetchArticles(params)` - 获取文章列表
- `fetchFeedArticles()` - 获取关注者文章
- `fetchArticle(slug)` - 获取单篇文章
- `createArticle(data)` - 创建文章
- `updateArticle(slug, data)` - 更新文章
- `deleteArticle(slug)` - 删除文章
- `favoriteArticle(slug)` - 收藏文章
- `unfavoriteArticle(slug)` - 取消收藏

### commentsStore - 评论管理
```typescript
interface CommentsState {
  comments: Comment[]
}

interface Comment {
  id: number
  body: string
  author: Profile
  createdAt: string
}
```

核心方法：
- `fetchComments(slug)`
- `addComment(slug, body)`
- `deleteComment(slug, id)`

### profileStore - 用户资料
```typescript
interface ProfileState {
  profile: Profile | null
}

interface Profile {
  username: string
  bio: string
  image: string
  following: boolean
}
```

核心方法：
- `fetchProfile(username)`
- `followUser(username)`
- `unfollowUser(username)`

### tagsStore - 标签管理
```typescript
interface TagsState {
  tags: string[]
  selectedTag: string | null
}
```

核心方法：
- `fetchTags()`
- `selectTag(tag)`
- `clearTag()`
