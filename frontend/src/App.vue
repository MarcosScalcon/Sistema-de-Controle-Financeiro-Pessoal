<template>
  <v-app>
    <v-app-bar app color="primary" elevation="2" v-if="authStore.isAuthenticated">
      <v-toolbar-title class="font-weight-bold text-h6">
        💰 Controle Financeiro
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn 
        variant="text"
        size="large"
        @click="$router.push('/dashboard')"
        :class="{ 'active-nav': $route.path === '/dashboard' }"
      >
        <v-icon left>mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      <v-btn 
        variant="text"
        size="large"
        @click="$router.push('/transactions')"
        :class="{ 'active-nav': $route.path === '/transactions' }"
      >
        <v-icon left>mdi-cash-multiple</v-icon>
        Transações
      </v-btn>
      <v-btn 
        icon
        size="large"
        @click="logout"
        class="ml-2"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-main style="background-color: #f5f5f5;">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    onMounted(() => {
      authStore.restoreSession()
    })
    
    const logout = async () => {
      await authStore.logout()
      router.push('/login')
    }
    
    return { authStore, logout }
  }
}
</script>

<style>
.active-nav {
  background-color: rgba(255, 255, 255, 0.15) !important;
}
</style>
