<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'

const route = useRoute()
const router = useRouter()

const username = route.params.username as string
const favorites = computed(() => route.name === 'profile-favorites')

const profile = ref<any>(null)
const articles = ref<any[]>([])
const articlesCount = ref(0)
const currentPage = ref(1)
const isLoading = ref(true)

const currentUser = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

const isAuthenticated = computed(() => !!localStorage.getItem('token'))

const isCurrentUser = computed(() => {
  return currentUser.value && currentUser.value.username === username
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

const fetchProfile = async () => {
  try {
    const { profile: p } = await api.profiles.get(username)
    profile.value = p
  } catch (e) {
    console.error(e)
    router.push('/')
  }
}

const fetchArticles = async () => {
  isLoading.value = true
  try {
    const params = { limit: 10, offset: (currentPage.value - 1) * 10 }
    let data
    
    if (favorites.value) {
      data = await api.articles.list({ ...params, favorited: username })
    } else {
      data = await api.articles.list({ ...params, author: username })
    }
    
    articles.value = data.articles
    articlesCount.value = data.articlesCount
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const follow = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  try {
    const { profile: p } = await api.profiles.follow(username)
    profile.value = { ...profile.value, following: p.following }
  } catch (e) {
    console.error(e)
  }
}

const unfollow = async () => {
  try {
    const { profile: p } = await api.profiles.unfollow(username)
    profile.value = { ...profile.value, following: p.following }
  } catch (e) {
    console.error(e)
  }
}

const favorite = async (slug: string) => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  try {
    const { article } = await api.articles.favorite(slug)
    const idx = articles.value.findIndex(a => a.slug === slug)
    if (idx !== -1) {
      articles.value[idx] = article
    }
  } catch (e) {
    console.error(e)
  }
}

const unfavorite = async (slug: string) => {
  try {
    const { article } = await api.articles.unfavorite(slug)
    const idx = articles.value.findIndex(a => a.slug === slug)
    if (idx !== -1) {
      articles.value[idx] = article
    }
  } catch (e) {
    console.error(e)
  }
}

watch(() => route.params.username, () => {
  if (route.name === 'profile' || route.name === 'profile-favorites') {
    fetchProfile()
    fetchArticles()
  }
})

watch(favorites, fetchArticles)
watch(currentPage, fetchArticles)

onMounted(() => {
  fetchProfile()
  fetchArticles()
})
</script>

<template>
  <div class="profile-page" v-if="profile">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img 
              :src="profile.image || 'https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg'" 
              class="user-img" 
            />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            
            <button 
              v-if="!isCurrentUser && !profile.following" 
              @click="follow" 
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-plus-round"></i>
              &nbsp; Follow {{ profile.username }}
            </button>
            <button 
              v-if="!isCurrentUser && profile.following" 
              @click="unfollow" 
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-minus-round"></i>
              &nbsp; Unfollow {{ profile.username }}
            </button>
            <router-link 
              v-if="isCurrentUser" 
              to="/settings" 
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </router-link>
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
                <router-link 
                  :to="`/profile/${username}`" 
                  class="nav-link"
                  :class="{ active: !favorites }"
                >My Articles</router-link>
              </li>
              <li class="nav-item">
                <router-link 
                  :to="`/profile/${username}/favorites`" 
                  class="nav-link"
                  :class="{ active: favorites }"
                >Favorited Articles</router-link>
              </li>
            </ul>
          </div>

          <div v-if="isLoading" class="article-preview">Loading...</div>
          
          <div v-else-if="articles.length === 0" class="article-preview">
            No articles are here... yet.
          </div>

          <template v-else>
            <div v-for="article in articles" :key="article.slug" class="article-preview">
              <div class="article-meta">
                <a :href="`/profile/${article.author.username}`">
                  <img :src="article.author.image || 'https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg'" />
                </a>
                <div class="info">
                  <a :href="`/profile/${article.author.username}`" class="author">{{ article.author.username }}</a>
                  <span class="date">{{ formatDate(article.createdAt) }}</span>
                </div>
                <button 
                  v-if="!article.favorited" 
                  @click="favorite(article.slug)" 
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
                <button 
                  v-else 
                  @click="unfavorite(article.slug)" 
                  class="btn btn-outline-primary btn-sm pull-xs-right active"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <a :href="`/article/${article.slug}`" class="preview-link">
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
                <ul class="tag-list">
                  <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
                    {{ tag }}
                  </li>
                </ul>
              </a>
            </div>

            <nav v-if="Math.ceil(articlesCount / 10) > 1">
              <ul class="pagination">
                <li v-for="page in Math.ceil(articlesCount / 10)" :key="page" class="page-item" :class="{ active: page === currentPage }">
                  <a class="page-link" href="" @click.prevent="currentPage = page">{{ page }}</a>
                </li>
              </ul>
            </nav>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
