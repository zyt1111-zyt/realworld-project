const API_BASE = 'http://localhost:8080/api'

export interface User {
  email: string
  username: string
  bio: string
  image: string
  token?: string
}

export interface Profile {
  username: string
  bio: string
  image: string
  following: boolean
}

export interface Article {
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

export interface Comment {
  id: number
  body: string
  author: Profile
  createdAt: string
}

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

  const text = await res.text()
  return text ? JSON.parse(text) : ({} as T)
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ user: User }>('/users/login', {
        method: 'POST',
        body: JSON.stringify({ user: { email, password } })
      }),
    register: (username: string, email: string, password: string) =>
      fetchApi<{ user: User }>('/users', {
        method: 'POST',
        body: JSON.stringify({ user: { username, email, password } })
      }),
    getCurrentUser: () =>
      fetchApi<{ user: User }>('/user', { method: 'GET' }),
    updateUser: (data: Partial<User>) =>
      fetchApi<{ user: User }>('/user', {
        method: 'PUT',
        body: JSON.stringify({ user: data })
      })
  },

  profiles: {
    get: (username: string) =>
      fetchApi<{ profile: Profile }>(`/profiles/${username}`),
    follow: (username: string) =>
      fetchApi<{ profile: Profile }>(`/profiles/${username}/follow`, { method: 'POST' }),
    unfollow: (username: string) =>
      fetchApi<{ profile: Profile }>(`/profiles/${username}/follow`, { method: 'DELETE' })
  },

  articles: {
    list: (params?: { tag?: string; author?: string; favorited?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      return fetchApi<{ articles: Article[]; articlesCount: number }>(`/articles${query ? `?${query}` : ''}`)
    },
    feed: (params?: { limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      return fetchApi<{ articles: Article[]; articlesCount: number }>(`/articles/feed${query ? `?${query}` : ''}`)
    },
    get: (slug: string) =>
      fetchApi<{ article: Article }>(`/articles/${slug}`),
    create: (data: { title: string; description: string; body: string; tagList?: string[] }) =>
      fetchApi<{ article: Article }>('/articles', {
        method: 'POST',
        body: JSON.stringify({ article: data })
      }),
    update: (slug: string, data: Partial<{ title: string; description: string; body: string }>) =>
      fetchApi<{ article: Article }>(`/articles/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({ article: data })
      }),
    delete: (slug: string) =>
      fetchApi<void>(`/articles/${slug}`, { method: 'DELETE' }),
    favorite: (slug: string) =>
      fetchApi<{ article: Article }>(`/articles/${slug}/favorite`, { method: 'POST' }),
    unfavorite: (slug: string) =>
      fetchApi<{ article: Article }>(`/articles/${slug}/favorite`, { method: 'DELETE' })
  },

  comments: {
    list: (slug: string) =>
      fetchApi<{ comments: Comment[] }>(`/articles/${slug}/comments`),
    add: (slug: string, body: string) =>
      fetchApi<{ comment: Comment }>(`/articles/${slug}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment: { body } })
      }),
    delete: (slug: string, id: number) =>
      fetchApi<void>(`/articles/${slug}/comments/${id}`, { method: 'DELETE' })
  },

  tags: {
    list: () =>
      fetchApi<{ tags: string[] }>('/tags')
  }
}
