<template>
  <v-container>
    <h1 class="text-h3 mb-6">Transações</h1>
    
    <v-btn color="primary" class="mb-4" @click="dialog = true">
      <v-icon left>mdi-plus</v-icon>
      Nova Transação
    </v-btn>
    
    <v-data-table
      :headers="headers"
      :items="transactions"
      class="elevation-2"
    >
      <template v-slot:item.amount="{ item }">
        <span :class="item.type === 'Entrada' ? 'text-success' : 'text-error'">
          R$ {{ item.amount }}
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    
    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Nova Transação</v-card-title>
        <v-card-text>
          <v-text-field label="Título" v-model="form.title"></v-text-field>
          <v-text-field label="Valor" v-model="form.amount" type="number"></v-text-field>
          <v-select 
            label="Tipo" 
            :items="['Entrada', 'Saída']" 
            v-model="form.type"
          ></v-select>
          <v-textarea label="Observações" v-model="form.notes"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import api from '../services/api'

export default {
  name: 'Transactions',
  setup() {
    const dialog = ref(false)
    const headers = [
      { title: 'Título', value: 'title' },
      { title: 'Valor', value: 'amount' },
      { title: 'Tipo', value: 'type' },
      { title: 'Data', value: 'date' },
      { title: 'Ações', value: 'actions', sortable: false }
    ]
    const transactions = ref([])
    const form = ref({ title: '', amount: 0, type: '', notes: '' })
    
    const loadTransactions = async () => {
      try {
        const response = await api.get('/transactions')
        transactions.value = response.data
      } catch (error) {
        console.error('Erro ao carregar transações:', error)
      }
    }
    
    const save = async () => {
      try {
        await api.post('/transactions', form.value)
        loadTransactions()
        dialog.value = false
      } catch (error) {
        console.error('Erro ao salvar:', error)
      }
    }
    
    const editItem = (item) => {
      form.value = { ...item }
      dialog.value = true
    }
    
    const deleteItem = async (item) => {
      if (confirm('Deseja excluir esta transação?')) {
        try {
          await api.delete(`/transactions/${item.id}`)
          loadTransactions()
        } catch (error) {
          console.error('Erro ao excluir:', error)
        }
      }
    }
    
    loadTransactions()
    
    return { dialog, headers, transactions, form, save, editItem, deleteItem }
  }
}
</script>