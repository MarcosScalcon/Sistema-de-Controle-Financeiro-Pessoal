const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

// Configurar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lista todas as transações
 *     description: Retorna todas as transações do banco de dados ordenadas por data
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Lista de transações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Erro no servidor
 */
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

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Busca uma transação por ID
 *     description: Retorna os detalhes de uma transação específica
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro no servidor
 */
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

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Cria uma nova transação
 *     description: Adiciona uma nova transação ao banco de dados
 *     tags: [Transações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Salário
 *               amount:
 *                 type: number
 *                 example: 3500.00
 *               type:
 *                 type: string
 *                 enum: [receita, despesa]
 *                 example: receita
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-05
 *               notes:
 *                 type: string
 *                 example: Pagamento mensal
 *               user_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
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

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Atualiza uma transação
 *     description: Atualiza os dados de uma transação existente
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [receita, despesa]
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro no servidor
 */
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

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Deleta uma transação
 *     description: Remove uma transação do banco de dados
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da transação a ser deletada
 *     responses:
 *       204:
 *         description: Transação deletada com sucesso
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro no servidor
 */
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

module.exports = router;
