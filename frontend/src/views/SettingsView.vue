<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'

const router = useRouter()

interface User {
  email: string
  username: string
  bio: string
  image: string
}

const user = ref<User>({
  email: '',
  username: '',
  bio: '',
  image: ''
})
const password = ref('')
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('auth-change'))
  window.location.href = '/'
}

const updateSettings = async () => {
  errors.value = {}
  isSubmitting.value = true
  
  try {
    const data: any = { email: user.value.email, bio: user.value.bio, image: user.value.image }
    if (user.value.username) data.username = user.value.username
    if (password.value) data.password = password.value
    
    const { user: updatedUser } = await api.auth.updateUser(data)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    router.push('/')
  } catch (e: any) {
    if (e.errors) {
      errors.value = e.errors
    } else {
      errors.value = { general: 'Update failed. Please try again.' }
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const u = JSON.parse(storedUser)
    user.value = {
      email: u.email || '',
      username: u.username || '',
      bio: u.bio || '',
      image: u.image || ''
    }
  }
})
</script>

<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <ul v-if="Object.keys(errors).length" class="error-messages">
            <li v-for="(msg, field) in errors" :key="field">{{ field }}: {{ msg }}</li>
          </ul>

          <form @submit.prevent="updateSettings">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="New Password"
                />
              </fieldset>
              <button 
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="isSubmitting"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          
          <hr />
          
          <button @click="logout" class="btn btn-outline-danger">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
