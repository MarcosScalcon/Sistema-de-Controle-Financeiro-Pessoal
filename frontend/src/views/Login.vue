<template>
  <div class="login-container">
    <v-card class="pa-6" width="400" elevation="8">
      <v-card-title class="text-h5 mb-4 text-center">
        💰 Controle Financeiro
      </v-card-title>
      <v-card-subtitle class="text-center mb-4">
        Faça login para continuar
      </v-card-subtitle>
      <v-card-text>
        <v-btn color="primary" block size="large" @click="handleGoogleLogin">
          <v-icon left>mdi-google</v-icon>
          Entrar com Google
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const handleGoogleLogin = () => {
      // TODO: Implementar login real com Supabase/Firebase
      // Por enquanto, simulando login
      authStore.setUser({
        name: 'Usuário Teste',
        email: 'teste@email.com',
        avatar: ''
      })
      router.push('/dashboard')
    }
    
    return { handleGoogleLogin }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>


ARQUIVO: frontend/src/views/Dashboard.vue
Crie este arquivo novo:

<template>
  <v-container>
    <h1 class="text-h3 mb-6">Dashboard</h1>
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="blue" dark elevation="4">
          <v-card-title>Saldo Total</v-card-title>
          <v-card-text class="text-h4">R$ 0,00</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="success" dark elevation="4">
          <v-card-title>Entradas</v-card-title>
          <v-card-text class="text-h4">R$ 0,00</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="error" dark elevation="4">
          <v-card-title>Saídas</v-card-title>
          <v-card-text class="text-h4">R$ 0,00</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>
