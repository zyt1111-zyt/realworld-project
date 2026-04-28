<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'

const route = useRoute()
const router = useRouter()

const slug = route.params.slug as string
const isEditing = computed(() => !!slug)

const title = ref('')
const description = ref('')
const body = ref('')
const tagInput = ref('')
const tags = ref<string[]>([])
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
  }
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  tags.value = tags.value.filter(t => t !== tag)
}

const publish = async () => {
  errors.value = {}
  isSubmitting.value = true
  
  try {
    const data = {
      title: title.value,
      description: description.value,
      body: body.value,
      tagList: tags.value
    }
    
    if (isEditing.value) {
      const { article } = await api.articles.update(slug, data)
      router.push(`/article/${article.slug}`)
    } else {
      const { article } = await api.articles.create(data)
      console.log('Article created, dispatching event')
      window.dispatchEvent(new Event('article-created'))
      router.push(`/article/${article.slug}`)
    }
  } catch (e: any) {
    if (e.errors) {
      errors.value = e.errors
    } else {
      errors.value = { general: 'Publishing failed. Please try again.' }
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      const { article } = await api.articles.get(slug)
      title.value = article.title
      description.value = article.description
      body.value = article.body
      tags.value = [...article.tagList]
    } catch (e) {
      console.error(e)
      router.push('/editor')
    }
  }
})
</script>

<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul v-if="Object.keys(errors).length" class="error-messages">
            <li v-for="(msg, field) in errors" :key="field">{{ field }}: {{ msg }}</li>
          </ul>

          <form @submit.prevent="publish">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tagInput"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  @keydown.enter.prevent="addTag"
                  @blur="addTag"
                />
                <div class="tag-list">
                  <span 
                    v-for="tag in tags" 
                    :key="tag" 
                    class="tag-default tag-pill"
                  >
                    <i class="ion-close-round" @click="removeTag(tag)"></i> {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button 
                class="btn btn-lg pull-xs-right btn-primary"
                type="submit"
                :disabled="isSubmitting"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
