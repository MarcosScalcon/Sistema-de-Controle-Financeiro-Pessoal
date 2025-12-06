<template>
  <v-container class="py-8">
    <div class="d-flex justify-space-between align-center mb-8">
      <h1 class="text-h3 font-weight-semibold">Transações</h1>
      <v-btn 
        color="primary" 
        size="large"
        elevation="0"
        @click="openNewDialog"
        class="px-6"
      >
        <v-icon left>mdi-plus</v-icon>
        Nova Transação
      </v-btn>
    </div>
    
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>
    
    <v-card elevation="2" rounded="lg">
      <v-data-table
        :headers="headers"
        :items="transactions"
        :loading="loading"
        class="transactions-table"
        :items-per-page="10"
      >
        <template v-slot:item.amount="{ item }">
          <span 
            :class="['font-weight-semibold', item.type === 'receita' ? 'text-success' : 'text-error']"
          >
            {{ item.type === 'receita' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
          </span>
        </template>
        <template v-slot:item.type="{ item }">
          <v-chip 
            :class="item.type === 'receita' ? 'chip-success' : 'chip-error'"
            size="small"
            label
          >
            <v-icon 
              :icon="item.type === 'receita' ? 'mdi-arrow-up' : 'mdi-arrow-down'" 
              size="16"
              start
            ></v-icon>
            {{ item.type === 'receita' ? 'Receita' : 'Despesa' }}
          </v-chip>
        </template>
        <template v-slot:item.date="{ item }">
          <span class="text-grey-darken-1">{{ formatDate(item.date) }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn 
            icon 
            size="small" 
            variant="text"
            @click="editItem(item)"
            class="mr-1"
          >
            <v-icon size="20">mdi-pencil</v-icon>
          </v-btn>
          <v-btn 
            icon 
            size="small" 
            variant="text"
            color="error"
            @click="confirmDelete(item)"
          >
            <v-icon size="20">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    
    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="550" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-h5 font-weight-semibold pa-6">
          {{ editMode ? 'Editar Transação' : 'Nova Transação' }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-text-field 
            label="Título" 
            v-model="form.title"
            :rules="[v => !!v || 'Título é obrigatório']"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>
          
          <v-text-field 
            label="Valor" 
            v-model="form.amount" 
            type="number"
            prefix="R$"
            :rules="[v => !!v || 'Valor é obrigatório', v => v > 0 || 'Valor deve ser positivo']"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>
          
          <v-select 
            label="Tipo" 
            :items="typeOptions" 
            v-model="form.type"
            :rules="[v => !!v || 'Tipo é obrigatório']"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-select>
          
          <v-text-field
            label="Data"
            v-model="form.date"
            type="date"
            :rules="[v => !!v || 'Data é obrigatória']"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>
          
          <v-textarea 
            label="Observações (opcional)" 
            v-model="form.notes"
            rows="3"
            variant="outlined"
            density="comfortable"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn 
            variant="outlined"
            size="large"
            @click="closeDialog"
            :disabled="saving"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="primary" 
            size="large"
            @click="save" 
            :loading="saving"
            elevation="0"
            class="px-8"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Dialog de Confirmação -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-semibold">
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          Deseja realmente excluir a transação <strong>{{ itemToDelete?.title }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteItem" :loading="deleting">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar para feedback -->
    <v-snackbar 
      v-model="snackbar" 
      :color="snackbarColor" 
      timeout="3000"
      location="top right"
      rounded="lg"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

export default {
  name: 'Transactions',
  setup() {
    const authStore = useAuthStore()
    const dialog = ref(false)
    const deleteDialog = ref(false)
    const loading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const editMode = ref(false)
    const snackbar = ref(false)
    const snackbarText = ref('')
    const snackbarColor = ref('success')
    const itemToDelete = ref(null)
    
    const headers = [
      { title: 'Título', value: 'title' },
      { title: 'Valor', value: 'amount' },
      { title: 'Tipo', value: 'type' },
      { title: 'Data', value: 'date' },
      { title: 'Ações', value: 'actions', sortable: false }
    ]
    
    const typeOptions = [
      { title: 'Receita', value: 'receita' },
      { title: 'Despesa', value: 'despesa' }
    ]
    
    const transactions = ref([])
    const form = ref({
      id: null,
      title: '',
      amount: null,
      type: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      user_id: null
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
    
    const showSnackbar = (message, color = 'success') => {
      snackbarText.value = message
      snackbarColor.value = color
      snackbar.value = true
    }
    
    const loadTransactions = async () => {
      try {
        loading.value = true
        const response = await api.get('/transactions')
        transactions.value = response.data
      } catch (error) {
        console.error('Erro ao carregar transações:', error)
        showSnackbar('Erro ao carregar transações', 'error')
      } finally {
        loading.value = false
      }
    }
    
    const openNewDialog = () => {
      editMode.value = false
      form.value = {
        id: null,
        title: '',
        amount: null,
        type: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        user_id: authStore.user?.id || null
      }
      dialog.value = true
    }
    
    const closeDialog = () => {
      dialog.value = false
      editMode.value = false
    }
    
    const save = async () => {
      try {
        saving.value = true
        
        if (!form.value.title || !form.value.amount || !form.value.type) {
          showSnackbar('Preencha todos os campos obrigatórios', 'warning')
          return
        }
        
        const payload = {
          ...form.value,
          user_id: authStore.user?.id || null
        }
        
        if (editMode.value) {
          await api.put(`/transactions/${form.value.id}`, payload)
          showSnackbar('Transação atualizada com sucesso!')
        } else {
          await api.post('/transactions', payload)
          showSnackbar('Transação criada com sucesso!')
        }
        
        loadTransactions()
        closeDialog()
      } catch (error) {
        console.error('Erro ao salvar:', error)
        showSnackbar('Erro ao salvar transação', 'error')
      } finally {
        saving.value = false
      }
    }
    
    const editItem = (item) => {
      editMode.value = true
      form.value = {
        id: item.id,
        title: item.title,
        amount: item.amount,
        type: item.type,
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: item.notes || '',
        user_id: item.user_id
      }
      dialog.value = true
    }
    
    const confirmDelete = (item) => {
      itemToDelete.value = item
      deleteDialog.value = true
    }
    
    const deleteItem = async () => {
      try {
        deleting.value = true
        await api.delete(`/transactions/${itemToDelete.value.id}`)
        showSnackbar('Transação excluída com sucesso!')
        loadTransactions()
        deleteDialog.value = false
      } catch (error) {
        console.error('Erro ao excluir:', error)
        showSnackbar('Erro ao excluir transação', 'error')
      } finally {
        deleting.value = false
      }
    }
    
    loadTransactions()
    
    return { 
      dialog, 
      deleteDialog,
      loading,
      saving,
      deleting,
      editMode,
      headers, 
      transactions, 
      typeOptions,
      form, 
      snackbar,
      snackbarText,
      snackbarColor,
      itemToDelete,
      openNewDialog,
      closeDialog,
      save, 
      editItem, 
      confirmDelete,
      deleteItem,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
.transactions-table ::v-deep tbody tr {
  transition: background-color 0.2s ease;
}

.transactions-table ::v-deep tbody tr:hover {
  background-color: #f5f5f5 !important;
}

.transactions-table ::v-deep th {
  font-weight: 600 !important;
  font-size: 0.95rem !important;
}

.transactions-table ::v-deep td {
  padding: 16px !important;
}

.chip-success {
  background-color: #E8F5E9 !important;
  color: #2E7D32 !important;
  font-weight: 500;
}

.chip-error {
  background-color: #FFEBEE !important;
  color: #C62828 !important;
  font-weight: 500;
}
</style>