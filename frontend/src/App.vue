<template>
  <v-app>
    <v-app-bar app color="primary" dark v-if="authStore.isAuthenticated">
      <v-toolbar-title>💰 Controle Financeiro</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="$router.push('/dashboard')">Dashboard</v-btn>
      <v-btn text @click="$router.push('/transactions')">Transações</v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-main>
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
