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

// ==================== ADMIN DASHBOARD ====================
app.get("/admin", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Medusa Admin - Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; background: #f5f5f5; }
    .navbar { background: #1a1a1a; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-weight: 700; font-size: 1.2rem; }
    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .header { margin-bottom: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #1a1a1a; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h2 { font-size: 0.9rem; color: #666; text-transform: uppercase; margin-bottom: 0.5rem; }
    .card .value { font-size: 2rem; font-weight: 700; color: #1a1a1a; }
    .section { background: white; padding: 2rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .section h2 { margin-bottom: 1rem; color: #1a1a1a; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; font-weight: 600; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge.success { background: #d4edda; color: #155724; }
    .badge.pending { background: #fff3cd; color: #856404; }
    .btn { padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; }
    .btn:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="navbar">
    <div class="logo">⚡ Medusa Admin</div>
    <div>Multi-Tenant E-Commerce</div>
  </div>
  
  <div class="container">
    <div class="header">
      <h1>Dashboard</h1>
      <p style="color: #666;">Bem-vindo ao painel administrativo do Medusa</p>
    </div>

    <div class="grid">
      <div class="card">
        <h2>Produtos</h2>
        <div class="value">1,234</div>
      </div>
      <div class="card">
        <h2>Pedidos</h2>
        <div class="value">567</div>
      </div>
      <div class="card">
        <h2>Receita</h2>
        <div class="value">$45,890</div>
      </div>
      <div class="card">
        <h2>Clientes</h2>
        <div class="value">892</div>
      </div>
    </div>

    <div class="section">
      <h2>Últimos Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Total</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#12345</td>
            <td>João Silva</td>
            <td><span class="badge success">Completo</span></td>
            <td>$299.90</td>
            <td>2024-03-20</td>
          </tr>
          <tr>
            <td>#12344</td>
            <td>Maria Santos</td>
            <td><span class="badge pending">Processando</span></td>
            <td>$149.99</td>
            <td>2024-03-19</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Funcionalidades</h2>
      <ul style="list-style: none;">
        <li style="padding: 0.5rem 0;">✓ Gestão de Produtos</li>
        <li style="padding: 0.5rem 0;">✓ Gestão de Pedidos</li>
        <li style="padding: 0.5rem 0;">✓ Gestão de Clientes</li>
        <li style="padding: 0.5rem 0;">✓ Analytics e Relatórios</li>
        <li style="padding: 0.5rem 0;">✓ Multi-Tenant Isolado</li>
        <li style="padding: 0.5rem 0;">✓ Chat IA em Tempo Real</li>
      </ul>
    </div>
  </div>
</body>
</html>
  `)
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
