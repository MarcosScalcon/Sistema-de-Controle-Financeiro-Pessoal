<template>
  <div class="login-container">
    <v-card class="login-card" width="450" elevation="12" rounded="lg">
      <v-card-title class="text-h4 mb-2 text-center font-weight-bold pt-8">
        💰 Controle Financeiro
      </v-card-title>
      <v-card-subtitle class="text-center mb-6 text-body-1">
        Gerencie suas finanças de forma inteligente
      </v-card-subtitle>
      <v-card-text class="px-8 pb-8">
        <v-btn 
          color="primary" 
          block 
          size="x-large" 
          class="google-btn"
          @click="handleGoogleLogin"
          elevation="0"
        >
          <v-icon left size="24">mdi-google</v-icon>
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
  background: linear-gradient(135deg, #E0F7FA 0%, #0288D1 100%);
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.google-btn {
  text-transform: none;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 56px !important;
}
</style>
