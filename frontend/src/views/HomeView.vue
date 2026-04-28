<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'

const route = useRoute()
const router = useRouter()

const articles = ref<any[]>([])
const articlesCount = ref(0)
const tags = ref<string[]>([])
const currentPage = ref(1)
const isLoading = ref(true)

const isAuthenticated = computed(() => !!localStorage.getItem('token'))

const selectedTag = computed(() => route.query.tag as string | null)
const activeTab = ref<'feed' | 'global'>('global')

const fetchArticles = async () => {
  isLoading.value = true
  try {
    let params: any = { limit: 10, offset: (currentPage.value - 1) * 10 }
    
    if (activeTab.value === 'feed' && isAuthenticated.value) {
      const data = await api.articles.feed(params)
      articles.value = data.articles
      articlesCount.value = data.articlesCount
    } else if (selectedTag.value) {
      params.tag = selectedTag.value
      const data = await api.articles.list(params)
      articles.value = data.articles
      articlesCount.value = data.articlesCount
    } else {
      const data = await api.articles.list(params)
      articles.value = data.articles
      articlesCount.value = data.articlesCount
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const favorite = async (slug: string) => {
  const { article: a } = await api.articles.favorite(slug)
  const idx = articles.value.findIndex(ar => ar.slug === slug)
  if (idx !== -1) {
    articles.value[idx] = a
  }
}

const unfavorite = async (slug: string) => {
  const { article: a } = await api.articles.unfavorite(slug)
  const idx = articles.value.findIndex(ar => ar.slug === slug)
  if (idx !== -1) {
    articles.value[idx] = a
  }
}

const fetchTags = async () => {
  try {
    console.log('Fetching tags...')
    const data = await api.tags.list()
    console.log('Tags fetched:', data.tags)
    tags.value = data.tags
  } catch (e) {
    console.error(e)
  }
}

const selectTag = (tag: string) => {
  activeTab.value = 'global'
  router.push({ query: { tag } })
}

const clearTag = () => {
  activeTab.value = 'global'
  router.push({ query: {} })
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

const totalPages = computed(() => Math.ceil(articlesCount.value / 10))

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, '...', current - 1, current, current + 1, '...', total]
})

watch(() => route.query.tag, fetchArticles)
watch(activeTab, fetchArticles)
watch(currentPage, fetchArticles)
watch(() => route.path, (newPath, oldPath) => {
  if (newPath === '/') {
    fetchTags()
  }
})

onMounted(() => {
  fetchArticles()
  fetchTags()
  window.addEventListener('auth-change', fetchArticles)
  window.addEventListener('article-created', () => {
    console.log('article-created event received, fetching tags')
    fetchTags()
  })
})

onUnmounted(() => {
  window.removeEventListener('auth-change', fetchArticles)
  window.removeEventListener('article-created', fetchTags)
})
</script>

<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font" style="font-family: SimSun, '宋体', serif; font-size: 60px; font-weight: 800; color: #333; letter-spacing: 1px;">Conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="isAuthenticated">
                <a 
                  class="nav-link" 
                  :class="{ active: activeTab === 'feed' }"
                  @click.prevent="activeTab = 'feed'"
                  href=""
                >Your Feed</a>
              </li>
              <li class="nav-item">
                <a 
                  class="nav-link" 
                  :class="{ active: activeTab === 'global' && !selectedTag }"
                  @click.prevent="clearTag"
                  href=""
                >Global Feed</a>
              </li>
              <li class="nav-item" v-if="selectedTag">
                <a class="nav-link active" href="">{{ selectedTag }}</a>
              </li>
            </ul>
          </div>

          <div v-if="isLoading" class="article-preview">Loading...</div>
          
          <div v-else-if="articles.length === 0" class="article-preview">No articles are here... yet.</div>

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
                  v-if="!article.favorited && isAuthenticated" 
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  @click="favorite(article.slug)"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
                <button 
                  v-else-if="isAuthenticated"
                  class="btn btn-primary btn-sm pull-xs-right"
                  @click="unfavorite(article.slug)"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
                <button v-else class="btn btn-outline-primary btn-sm pull-xs-right">
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

            <nav v-if="totalPages >= 1" style="display: flex; justify-content: center;">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="" @click.prevent="currentPage > 1 && (currentPage = currentPage - 1)">Prev</a>
                </li>
                <li v-for="page in displayedPages" :key="page" class="page-item" :class="{ active: page === currentPage, disabled: page === '...' }">
                  <span v-if="page === '...'">...</span>
                  <a v-else class="page-link" href="" @click.prevent="currentPage = Number(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="" @click.prevent="currentPage < totalPages && (currentPage = currentPage + 1)">Next</a>
                </li>
              </ul>
            </nav>
          </template>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <a 
                v-for="tag in tags" 
                :key="tag" 
                href="" 
                class="tag-pill tag-default"
                @click.prevent="selectTag(tag)"
              >{{ tag }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
