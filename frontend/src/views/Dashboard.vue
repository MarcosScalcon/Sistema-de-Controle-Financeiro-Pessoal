<template>
  <v-container class="py-8">
    <h1 class="text-h3 mb-8 font-weight-semibold">Dashboard</h1>
    
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>
    
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="primary" dark elevation="2" rounded="lg" class="stat-card">
          <v-card-title class="text-subtitle-1">Saldo Total</v-card-title>
          <v-card-text class="text-h4 font-weight-bold">{{ formatCurrency(saldoTotal) }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="stat-card stat-card-success" elevation="2" rounded="lg">
          <v-card-title class="text-subtitle-1 text-success">Entradas</v-card-title>
          <v-card-text class="text-h4 font-weight-bold text-success">
            {{ formatCurrency(entradas) }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="stat-card stat-card-error" elevation="2" rounded="lg">
          <v-card-title class="text-subtitle-1 text-error">Saídas</v-card-title>
          <v-card-text class="text-h4 font-weight-bold text-error">
            {{ formatCurrency(saidas) }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg">
          <v-card-title class="text-h6 font-weight-semibold">Últimas Transações</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list v-if="recentTransactions.length > 0" lines="two">
              <v-list-item 
                v-for="(transaction, index) in recentTransactions" 
                :key="transaction.id"
                class="transaction-item"
              >
                <template v-slot:prepend>
                  <v-avatar :color="transaction.type === 'receita' ? 'success' : 'error'" size="40">
                    <v-icon color="white">
                      {{ transaction.type === 'receita' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                    </v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{ transaction.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-grey-darken-1">{{ formatDate(transaction.date) }}</v-list-item-subtitle>
                <template v-slot:append>
                  <span 
                    :class="['text-h6', 'font-weight-semibold', transaction.type === 'receita' ? 'text-success' : 'text-error']"
                  >
                    {{ transaction.type === 'receita' ? '+' : '-' }} {{ formatCurrency(transaction.amount) }}
                  </span>
                </template>
                <v-divider v-if="index < recentTransactions.length - 1"></v-divider>
              </v-list-item>
            </v-list>
            <div v-else class="text-center pa-8 text-grey">
              <v-icon size="64" color="grey-lighten-1">mdi-cash-remove</v-icon>
              <p class="text-body-1 mt-4">Nenhuma transação cadastrada ainda.</p>
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

<style scoped>
.stat-card {
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card-success {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
}

.stat-card-error {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
}

.transaction-item {
  min-height: 72px;
  transition: background-color 0.2s ease;
}

.transaction-item:hover {
  background-color: #f5f5f5;
}
</style>
