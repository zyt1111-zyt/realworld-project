---
name: realworld-auth
description: RealWorld项目认证流程规范，JWT token管理和用户状态
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  workflow: authentication
---

## 认证流程

### 登录
1. 调用 `POST /api/users/login`
2. 成功后返回 `{ user: { token, email, username, bio, image } }`
3. 将token存储到localStorage

### 注册
1. 调用 `POST /api/users`
2. 成功后同样返回token
3. 存储token到localStorage

### Token存储
```typescript
localStorage.setItem('token', user.token)
localStorage.setItem('user', JSON.stringify(user))
```

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

## 用户状态管理
使用Pinia store管理用户认证状态，包含：
- currentUser: 当前用户信息
- isAuthenticated: 是否已登录
- token: JWT token

## User 数据结构
```typescript
interface User {
  email: string
  username: string
  bio: string | null
  image: string | null
  token: string
}
```

## 登录流程
1. 调用 `POST /api/users/login`，body: `{ "user": { "email", "password" } }`
2. 成功后返回 `{ user: { token, email, username, bio, image } }`
3. 存储 token: `localStorage.setItem('token', user.token)`
4. 存储用户: `localStorage.setItem('user', JSON.stringify(user))`

## 注册流程
1. 调用 `POST /api/users`，body: `{ "user": { "username", "email", "password" } }`
2. 成功后返回 token
3. 存储 token 和用户信息

## 退出登录
```typescript
localStorage.removeItem('token')
localStorage.removeItem('user')
```
