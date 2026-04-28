<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'

const route = useRoute()
const router = useRouter()

const slug = route.params.slug as string

const article = ref<any>(null)
const comments = ref<any[]>([])
const newComment = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)

const currentUser = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

const isAuthenticated = computed(() => !!localStorage.getItem('token'))

const isAuthor = computed(() => {
  return currentUser.value && article.value && currentUser.value.username === article.value.author.username
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

const isCommentAuthor = (comment: any) => {
  return currentUser.value && comment.author.username === currentUser.value.username
}

const fetchArticle = async () => {
  try {
    const { article: a } = await api.articles.get(slug)
    article.value = a
  } catch (e) {
    console.error(e)
    router.push('/')
  }
}

const fetchComments = async () => {
  try {
    const { comments: c } = await api.comments.list(slug)
    comments.value = c
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const deleteArticle = async () => {
  if (!confirm('Are you sure you want to delete this article?')) return
  try {
    console.log('Deleting article:', slug)
    await api.articles.delete(slug)
    console.log('Article deleted, navigating to home')
    router.push('/')
  } catch (e) {
    console.error('Delete failed:', e)
    alert('Failed to delete article. Please try again.')
  }
}

const favorite = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  try {
    const { article: a } = await api.articles.favorite(slug)
    article.value = a
  } catch (e) {
    console.error(e)
  }
}

const unfavorite = async () => {
  try {
    const { article: a } = await api.articles.unfavorite(slug)
    article.value = a
  } catch (e) {
    console.error(e)
  }
}

const follow = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  try {
    const { profile } = await api.profiles.follow(article.value.author.username)
    article.value.author = { ...article.value.author, following: profile.following }
  } catch (e) {
    console.error(e)
  }
}

const unfollow = async () => {
  try {
    const { profile } = await api.profiles.unfollow(article.value.author.username)
    article.value.author = { ...article.value.author, following: profile.following }
  } catch (e) {
    console.error(e)
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  isSubmitting.value = true
  try {
    const { comment } = await api.comments.add(slug, newComment.value)
    comments.value.unshift(comment)
    newComment.value = ''
  } catch (e) {
    console.error(e)
  } finally {
    isSubmitting.value = false
  }
}

const deleteComment = async (id: number) => {
  if (!confirm('Are you sure you want to delete this comment?')) return
  try {
    await api.comments.delete(slug, id)
    comments.value = comments.value.filter(c => c.id !== id)
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchArticle()
  fetchComments()
})
</script>

<template>
  <div class="article-page" v-if="article">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <a :href="`/profile/${article.author.username}`">
            <img :src="article.author.image || 'https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg'" />
          </a>
          <div class="info">
            <a :href="`/profile/${article.author.username}`" class="author">{{ article.author.username }}</a>
            <span class="date">{{ formatDate(article.createdAt) }}</span>
          </div>
          
          <template v-if="!isAuthor">
            <button 
              v-if="!article.author.following" 
              @click="follow" 
              class="btn btn-sm btn-outline-secondary"
            >
              <i class="ion-plus-round"></i>
              &nbsp; Follow {{ article.author.username }}
            </button>
            <button 
              v-else 
              @click="unfollow" 
              class="btn btn-sm btn-outline-secondary"
            >
              <i class="ion-minus-round"></i>
              &nbsp; Unfollow {{ article.author.username }}
            </button>
            &nbsp;&nbsp;
            <button 
              v-if="!article.favorited" 
              @click="favorite" 
              class="btn btn-sm btn-outline-primary"
            >
              <i class="ion-heart"></i>
              &nbsp; Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
            </button>
            <button 
              v-else 
              @click="unfavorite" 
              class="btn btn-sm btn-outline-primary active"
            >
              <i class="ion-heart"></i>
              &nbsp; Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
            </button>
          </template>
          
          <span v-if="isAuthor">
            <a :href="`/editor/${article.slug}`" class="btn btn-sm btn-outline-secondary">
              <i class="ion-edit"></i> Edit Article
            </a>
            <button @click="deleteArticle" class="btn btn-sm btn-outline-danger">
              <i class="ion-trash-a"></i> Delete Article
            </button>
          </span>
        </div>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <p>{{ article.body }}</p>
          <ul class="tag-list">
            <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <div class="article-meta">
          <a :href="`/profile/${article.author.username}`">
            <img :src="article.author.image || 'https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg'" />
          </a>
          <div class="info">
            <a :href="`/profile/${article.author.username}`" class="author">{{ article.author.username }}</a>
            <span class="date">{{ formatDate(article.createdAt) }}</span>
          </div>
          
          <template v-if="!isAuthor">
            <button 
              v-if="!article.author.following" 
              @click="follow" 
              class="btn btn-sm btn-outline-secondary"
            >
              <i class="ion-plus-round"></i>
              &nbsp; Follow {{ article.author.username }}
            </button>
            <button 
              v-else 
              @click="unfollow" 
              class="btn btn-sm btn-outline-secondary"
            >
              <i class="ion-minus-round"></i>
              &nbsp; Unfollow {{ article.author.username }}
            </button>
            &nbsp;
            <button 
              v-if="!article.favorited" 
              @click="favorite" 
              class="btn btn-sm btn-outline-primary"
            >
              <i class="ion-heart"></i>
              &nbsp; Favorite Article <span class="counter">({{ article.favoritesCount }})</span>
            </button>
            <button 
              v-else 
              @click="unfavorite" 
              class="btn btn-sm btn-outline-primary active"
            >
              <i class="ion-heart"></i>
              &nbsp; Favorite Article <span class="counter">({{ article.favoritesCount }})</span>
            </button>
          </template>
          
          <span v-if="isAuthor">
            <a :href="`/editor/${article.slug}`" class="btn btn-sm btn-outline-secondary">
              <i class="ion-edit"></i> Edit Article
            </a>
            <button @click="deleteArticle" class="btn btn-sm btn-outline-danger">
              <i class="ion-trash-a"></i> Delete Article
            </button>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form v-if="isAuthenticated" class="card comment-form" @submit.prevent="addComment">
            <div class="card-block">
              <textarea 
                v-model="newComment" 
                class="form-control" 
                placeholder="Write a comment..." 
                rows="3"
              ></textarea>
            </div>
            <div class="card-footer">
              <img 
                :src="currentUser?.image || 'https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg'" 
                class="comment-author-img" 
              />
              <button class="btn btn-sm btn-primary" :disabled="isSubmitting">Post Comment</button>
            </div>
          </form>
          
          <div v-if="!isAuthenticated" class="article-preview" style="text-align: center; padding: 2rem;">
            <router-link to="/login">Sign in</router-link> or <router-link to="/register">sign up</router-link> to add comments.
          </div>

          <div v-for="comment in comments" :key="comment.id" class="card">
            <div class="card-block">
              <p class="card-text">{{ comment.body }}</p>
            </div>
            <div class="card-footer">
              <a :href="`/profile/${comment.author.username}`" class="comment-author">
                <img 
                  :src="comment.author.image || 'https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg'" 
                  class="comment-author-img" 
                />
              </a>
              &nbsp;
              <a :href="`/profile/${comment.author.username}`" class="comment-author">{{ comment.author.username }}</a>
              <span class="date-posted">{{ formatDate(comment.createdAt) }}</span>
              <span v-if="isCommentAuthor(comment)" class="mod-options">
                <i @click="deleteComment(comment.id)" class="ion-trash-a"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="container page">
    <div class="article-preview">Loading...</div>
  </div>
</template>
