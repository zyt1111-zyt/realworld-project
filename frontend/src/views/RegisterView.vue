<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const register = async () => {
  errors.value = {}
  isSubmitting.value = true
  
  try {
    const { user } = await api.auth.register(username.value, email.value, password.value)
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
      errors.value = { general: 'Registration failed. Please try again.' }
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
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <router-link to="/login">Have an account?</router-link>
          </p>

          <ul v-if="Object.keys(errors).length" class="error-messages">
            <li v-for="(msg, field) in errors" :key="field">{{ field }}: {{ msg }}</li>
          </ul>

          <form @submit.prevent="register">
            <fieldset class="form-group">
              <input
                v-model="username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Username"
                required
              />
            </fieldset>
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
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
