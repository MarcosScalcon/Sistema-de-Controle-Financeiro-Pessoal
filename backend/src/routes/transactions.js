import express from 'express'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Garantir que as variáveis de ambiente estejam carregadas
dotenv.config()

const router = express.Router()

// Configurar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Listar todas
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET - Buscar por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', req.params.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Transação não encontrada' })
      }
      throw error
    }
    
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST - Criar
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, date, notes, user_id } = req.body
    
    // Validação básica
    if (!title || !amount || !type) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: title, amount, type' 
      })
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        title,
        amount: parseFloat(amount),
        type,
        date: date || new Date().toISOString(),
        notes: notes || '',
        user_id: user_id || null
      }])
      .select()
      .single()
    
    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT - Atualizar
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, type, date, notes } = req.body
    
    const { data, error } = await supabase
      .from('transactions')
      .update({
        ...(title && { title }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(type && { type }),
        ...(date && { date }),
        ...(notes !== undefined && { notes })
      })
      .eq('id', req.params.id)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Transação não encontrada' })
      }
      throw error
    }
    
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE - Excluir
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', req.params.id)
    
    if (error) throw error
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
