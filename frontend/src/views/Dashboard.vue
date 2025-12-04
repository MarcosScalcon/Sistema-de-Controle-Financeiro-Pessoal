<template>
  <v-container>
    <h1 class="text-h3 mb-6">Dashboard</h1>
    
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>
    
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="blue" dark elevation="4">
          <v-card-title>Saldo Total</v-card-title>
          <v-card-text class="text-h4">{{ formatCurrency(saldoTotal) }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="success" dark elevation="4">
          <v-card-title>Entradas</v-card-title>
          <v-card-text class="text-h4">{{ formatCurrency(entradas) }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="error" dark elevation="4">
          <v-card-title>Saídas</v-card-title>
          <v-card-text class="text-h4">{{ formatCurrency(saidas) }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Últimas Transações</v-card-title>
          <v-card-text>
            <v-list v-if="recentTransactions.length > 0">
              <v-list-item v-for="transaction in recentTransactions" :key="transaction.id">
                <template v-slot:prepend>
                  <v-icon :color="transaction.type === 'receita' ? 'success' : 'error'">
                    {{ transaction.type === 'receita' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                  </v-icon>
                </template>
                <v-list-item-title>{{ transaction.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(transaction.date) }}</v-list-item-subtitle>
                <template v-slot:append>
                  <span :class="transaction.type === 'receita' ? 'text-success' : 'text-error'">
                    {{ formatCurrency(transaction.amount) }}
                  </span>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="text-center pa-4 text-grey">
              Nenhuma transação cadastrada ainda.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

export default {
  name: 'Dashboard',
  setup() {
    const transactions = ref([])
    const loading = ref(true)
    
    const entradas = computed(() => {
      return transactions.value
        .filter(t => t.type === 'receita')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    })
    
    const saidas = computed(() => {
      return transactions.value
        .filter(t => t.type === 'despesa')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    })
    
    const saldoTotal = computed(() => entradas.value - saidas.value)
    
    const recentTransactions = computed(() => {
      return transactions.value.slice(0, 5)
    })
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('pt-BR').format(date)
    }
    
    const loadTransactions = async () => {
      try {
        loading.value = true
        const response = await api.get('/transactions')
        transactions.value = response.data
      } catch (error) {
        console.error('Erro ao carregar transações:', error)
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      loadTransactions()
    })
    
    return { 
      loading,
      entradas, 
      saidas, 
      saldoTotal, 
      recentTransactions,
      formatCurrency,
      formatDate
    }
  }
}
</script>
