import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || "development"

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.STORE_CORS?.split(",") || "*",
  credentials: true
}))
app.use(express.static(path.join(__dirname, "public")))

// Logger
function log(level, message, context = {}) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    environment: NODE_ENV,
    ...context,
  }
  console.log(JSON.stringify(logEntry))
}

// ==================== ROTAS DE SAÚDE ====================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
    medusa: {
      version: "2.0.0",
      multiTenant: true,
      features: ["admin", "storefront", "api", "chat"]
    }
  })
})

// ==================== API REST ====================
app.get("/api/produtos", (req, res) => {
  res.json({
    data: [
      { id: 1, nome: "Smartphone", preco: 599.99, estoque: 45 },
      { id: 2, nome: "Laptop", preco: 999.99, estoque: 23 },
      { id: 3, nome: "Smartwatch", preco: 299.99, estoque: 67 }
    ],
    total: 3
  })
})

app.get("/api/pedidos", (req, res) => {
  res.json({
    data: [
      { id: "12345", cliente: "João Silva", status: "completo", total: 299.90 },
      { id: "12344", cliente: "Maria Santos", status: "processando", total: 149.99 }
    ],
    total: 2
  })
})

// ==================== CHAT IA MULTI-TENANT ====================
app.post("/api/tenant/:tenantId/chat", express.json(), (req, res) => {
  const { tenantId } = req.params
  const { message, userId } = req.body

  if (!message) {
    return res.status(400).json({ error: "Message é obrigatório" })
  }

  log("info", "Chat message received", { tenantId, userId, messageLength: message.length })

  res.json({
    success: true,
    response: `Olá! Você é do tenant ${tenantId}. Recebi sua mensagem: "${message}". Como posso ajudar?`,
    tenantId,
    userId,
    timestamp: new Date().toISOString()
  })
})

app.get("/api/tenant/:tenantId/chat", (req, res) => {
  const { tenantId } = req.params
  
  res.json({
    messages: [
      { id: 1, sender: "bot", text: "Bem-vindo! Como posso ajudar?" },
      { id: 2, sender: "user", text: "Quais são os melhores produtos?" },
      { id: 3, sender: "bot", text: "Recomendo nossos smartphones e laptops!" }
    ],
    tenantId
  })
})

// ==================== TRATAMENTO DE ERROS ====================
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
    method: req.method,
    availableRoutes: [
      "GET /",
      "GET /admin",
      "GET /health",
      "GET /api/produtos",
      "GET /api/pedidos",
      "POST /api/tenant/:tenantId/chat",
      "GET /api/tenant/:tenantId/chat"
    ]
  })
})

// ==================== INICIALIZAÇÃO ====================
app.listen(PORT, "0.0.0.0", () => {
  log("info", "Servidor Medusa iniciado", { port: PORT, environment: NODE_ENV })
  console.log(`ready - started server on 0.0.0.0:${PORT}, url: http://localhost:${PORT}`)
})

process.on("SIGTERM", () => {
  log("warn", "SIGTERM recebido, encerrando...")
  process.exit(0)
})
