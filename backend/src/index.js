import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import transactionsRouter from './routes/transactions.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando!' })
})

app.use('/api/transactions', transactionsRouter)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})
