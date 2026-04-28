---
name: realworld-setup
description: RealWorld项目初始化配置和规范
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  workflow: project-setup
---

## 项目技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router

## 依赖安装

```bash
npm install vue vue-router pinia
npm install -D vite @vitejs/plugin-vue typescript vue-tsc
```

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

## API封装建议

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

## CSS样式

使用项目提供的共享样式文件：

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

## 默认头像

当用户没有头像时，显示默认头像：
```html
<img src="https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg" alt="Default Avatar" />
```

或使用 CSS 类 `.user-pic` / `.user-img` / `.comment-author-img` 配合默认图。
