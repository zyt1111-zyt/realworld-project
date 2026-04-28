<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'

const router = useRouter()

const email = ref('')
const password = ref('')
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const login = async () => {
  errors.value = {}
  isSubmitting.value = true
  
  try {
    const { user } = await api.auth.login(email.value, password.value)
    if (user.token) {
      localStorage.setItem('token', user.token)
    }
    localStorage.setItem('user', JSON.stringify(user))
    window.dispatchEvent(new Event('auth-change'))
    router.push('/')
  } catch (e: any) {
    if (e.errors) {
      errors.value = e.errors
    } else {
      errors.value = { general: 'Login failed. Please check your credentials.' }
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <router-link to="/register">Need an account?</router-link>
          </p>

          <ul v-if="Object.keys(errors).length" class="error-messages">
            <li v-for="(msg, field) in errors" :key="field">{{ field }}: {{ msg }}</li>
          </ul>

          <form @submit.prevent="login">
            <fieldset class="form-group">
              <input
                v-model="email"
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                required
              />
            </fieldset>
            <button 
              class="btn btn-lg btn-primary pull-xs-right" 
              :disabled="isSubmitting"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
