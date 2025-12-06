const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Controle Financeiro Pessoal',
      version: '1.0.0',
      description: 'Documentação da API REST para gerenciamento de transações financeiras',
      contact: {
        name: 'Marcos Scalcon & Natan Benites',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      schemas: {
        Transaction: {
          type: 'object',
          required: ['title', 'amount', 'type', 'date'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da transação',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuário proprietário',
            },
            title: {
              type: 'string',
              description: 'Título da transação',
              example: 'Salário',
            },
            amount: {
              type: 'number',
              format: 'decimal',
              description: 'Valor da transação',
              example: 3500.00,
            },
            type: {
              type: 'string',
              enum: ['receita', 'despesa'],
              description: 'Tipo da transação',
              example: 'receita',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Data da transação',
              example: '2025-12-05',
            },
            notes: {
              type: 'string',
              description: 'Observações adicionais',
              example: 'Pagamento mensal',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos com anotações
};

module.exports = swaggerJsdoc(options);