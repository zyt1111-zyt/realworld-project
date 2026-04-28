---
name: realworld-router
description: RealWorld项目路由配置规范
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  workflow: routing
---

## 路由配置

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

## 路由守卫

### 需要认证的路由
- `/settings`
- `/editor`
- `/editor/:slug`

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

## 路由名称规范
- home
- login
- register
- settings
- editor-create
- editor-edit
- article
- profile
- profile-favorites
