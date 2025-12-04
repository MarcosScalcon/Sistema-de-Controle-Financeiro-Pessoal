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

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    
    const handleGoogleLogin = async () => {
      try {
        await authStore.loginWithGoogle()
      } catch (error) {
        console.error('Erro ao fazer login:', error)
        alert('Erro ao fazer login. Verifique as configurações do Supabase.')
      }
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
