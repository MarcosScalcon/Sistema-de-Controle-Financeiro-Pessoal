import express from 'express'

const router = express.Router()

// Armazenamento temporário em memória (depois substituir por banco)
let transactions = []
let nextId = 1

// GET - Listar todas
router.get('/', (req, res) => {
  res.json(transactions)
})

// GET - Buscar por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const transaction = transactions.find(t => t.id === id)
  
  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' })
  }
  
  res.json(transaction)
})

// POST - Criar
router.post('/', (req, res) => {
  const { title, amount, type, date, notes, user_id } = req.body
  
  // Validação básica
  if (!title || !amount || !type) {
    return res.status(400).json({ 
      error: 'Campos obrigatórios: title, amount, type' 
    })
  }
  
  const newTransaction = {
    id: nextId++,
    title,
    amount: parseFloat(amount),
    type,
    date: date || new Date().toISOString(),
    notes: notes || '',
    user_id: user_id || null
  }
  
  transactions.push(newTransaction)
  res.status(201).json(newTransaction)
})

// PUT - Atualizar
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = transactions.findIndex(t => t.id === id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Transação não encontrada' })
  }
  
  transactions[index] = {
    ...transactions[index],
    ...req.body,
    id // Manter ID original
  }
  
  res.json(transactions[index])
})

// DELETE - Excluir
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = transactions.findIndex(t => t.id === id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Transação não encontrada' })
  }
  
  transactions.splice(index, 1)
  res.status(204).send()
})

export default router
