<template>
  <v-container>
    <h1 class="text-h3 mb-6">Transações</h1>
    
    <v-btn color="primary" class="mb-4" @click="openNewDialog">
      <v-icon left>mdi-plus</v-icon>
      Nova Transação
    </v-btn>
    
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>
    
    <v-data-table
      :headers="headers"
      :items="transactions"
      :loading="loading"
      class="elevation-2"
    >
      <template v-slot:item.amount="{ item }">
        <span :class="item.type === 'receita' ? 'text-success' : 'text-error'">
          {{ formatCurrency(item.amount) }}
        </span>
      </template>
      <template v-slot:item.type="{ item }">
        <v-chip :color="item.type === 'receita' ? 'success' : 'error'" size="small">
          {{ item.type === 'receita' ? 'Receita' : 'Despesa' }}
        </v-chip>
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.date) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    
    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ editMode ? 'Editar Transação' : 'Nova Transação' }}</v-card-title>
        <v-card-text>
          <v-text-field 
            label="Título" 
            v-model="form.title"
            :rules="[v => !!v || 'Título é obrigatório']"
          ></v-text-field>
          
          <v-text-field 
            label="Valor" 
            v-model="form.amount" 
            type="number"
            prefix="R$"
            :rules="[v => !!v || 'Valor é obrigatório', v => v > 0 || 'Valor deve ser positivo']"
          ></v-text-field>
          
          <v-select 
            label="Tipo" 
            :items="typeOptions" 
            v-model="form.type"
            :rules="[v => !!v || 'Tipo é obrigatório']"
          ></v-select>
          
          <v-text-field
            label="Data"
            v-model="form.date"
            type="date"
            :rules="[v => !!v || 'Data é obrigatória']"
          ></v-text-field>
          
          <v-textarea 
            label="Observações" 
            v-model="form.notes"
            rows="3"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="save" :loading="saving">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar para feedback -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
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
    const loading = ref(false)
    const saving = ref(false)
    const editMode = ref(false)
    const snackbar = ref(false)
    const snackbarText = ref('')
    const snackbarColor = ref('success')
    
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
    
    const deleteItem = async (item) => {
      if (confirm(`Deseja realmente excluir "${item.title}"?`)) {
        try {
          loading.value = true
          await api.delete(`/transactions/${item.id}`)
          showSnackbar('Transação excluída com sucesso!')
          loadTransactions()
        } catch (error) {
          console.error('Erro ao excluir:', error)
          showSnackbar('Erro ao excluir transação', 'error')
        } finally {
          loading.value = false
        }
      }
    }
    
    loadTransactions()
    
    return { 
      dialog, 
      loading,
      saving,
      editMode,
      headers, 
      transactions, 
      typeOptions,
      form, 
      snackbar,
      snackbarText,
      snackbarColor,
      openNewDialog,
      closeDialog,
      save, 
      editItem, 
      deleteItem,
      formatCurrency,
      formatDate
    }
  }
}
</script>