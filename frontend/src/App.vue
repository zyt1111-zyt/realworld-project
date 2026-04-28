<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'

const currentUser = ref<any>(null)
const isAuthenticated = ref(false)

const updateAuth = () => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  isAuthenticated.value = !!token
  currentUser.value = user ? JSON.parse(user) : null
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isAuthenticated.value = false
  currentUser.value = null
  window.location.href = '/'
}

onMounted(() => {
  updateAuth()
  window.addEventListener('storage', updateAuth)
  window.addEventListener('auth-change', updateAuth)
})

onUnmounted(() => {
  window.removeEventListener('storage', updateAuth)
  window.removeEventListener('auth-change', updateAuth)
})

defineExpose({ handleLogout })
</script>

<template>
  <div id="app">
    <nav class="navbar navbar-light" v-if="isAuthenticated">
      <div class="container">
        <router-link class="navbar-brand" to="/" style="font-family: SimSun, '宋体', serif;">Conduit</router-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/editor">
              <i class="ion-compose"></i>&nbsp;New Article
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/settings">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="`/profile/${currentUser?.username}`">
              <img :src="currentUser?.image || 'https://raw.githubusercontent.com/realworld-apps/realworld/main/assets/media/default-avatar.svg'" class="user-pic" />
              {{ currentUser?.username }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <nav class="navbar navbar-light" v-else>
      <div class="container">
        <router-link class="navbar-brand" to="/" style="font-family: SimSun, '宋体', serif;">Conduit</router-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Sign in</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Sign up</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <RouterView />

    <footer>
      <div class="container">
        
        <a href="/" class="logo-font" style="font-family: SimSun, '宋体', serif; font-size: 20px; color: #333; font-weight: 600; ">Conduit</a>
        <span class="attribution">
          An interactive learning project. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&display=swap');

body {
  font-family: 'Source Sans Pro', sans-serif;
}

.navbar-brand {
  font-family: 'Titillium Web', sans-serif;
  font-weight: 700;
}

.logo-font {
  font-family: 'Titillium Web', sans-serif;
  font-weight: 700;
}
</style>
