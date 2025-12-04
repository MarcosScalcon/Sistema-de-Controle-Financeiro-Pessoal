import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  
  actions: {
    async loginWithGoogle() {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`
          }
        })
        if (error) throw error
        return data
      } catch (error) {
        console.error('Erro no login:', error)
        throw error
      }
    },
    
    setUser(userData) {
      this.user = userData
      this.isAuthenticated = true
    },
    
    async logout() {
      try {
        await supabase.auth.signOut()
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        console.error('Erro no logout:', error)
      }
    },
    
    async restoreSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          this.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
            avatar: session.user.user_metadata?.avatar_url || ''
          }
          this.isAuthenticated = true
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error)
      }
    }
  }
})
