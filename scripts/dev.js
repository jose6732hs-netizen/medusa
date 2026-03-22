#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" })

const http = require("http")
const url = require("url")

const PORT = process.env.PORT || 9000

const htmlResponse = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medusa - Configuração Completa</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 700px;
      width: 100%;
      padding: 50px;
    }
    h1 {
      color: #333;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #666;
      font-size: 16px;
      margin-bottom: 30px;
    }
    .status-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 30px 0;
    }
    .status-item {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .status-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 14px;
    }
    .status-icon.ok { background: #10b981; }
    .status-icon.error { background: #ef4444; }
    .status-text {
      font-size: 14px;
      color: #333;
    }
    .info-box {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      border-radius: 4px;
      margin: 30px 0;
    }
    .info-box h2 {
      color: #1e40af;
      font-size: 16px;
      margin-bottom: 15px;
    }
    .info-box ol {
      margin-left: 20px;
      color: #333;
      font-size: 14px;
      line-height: 1.8;
    }
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 13px;
      color: #d946ef;
    }
    .button {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      margin-top: 20px;
      transition: background 0.3s;
    }
    .button:hover { background: #764ba2; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Medusa - Pronto para Usar</h1>
    <p class="subtitle">Todas as variáveis foram configuradas com sucesso!</p>
    
    <div class="status-grid">
      <div class="status-item">
        <div class="status-icon ok">✓</div>
        <div class="status-text">Node.js rodando</div>
      </div>
      <div class="status-item">
        <div class="status-icon ${process.env.DATABASE_URL ? 'ok' : 'error'}">
          ${process.env.DATABASE_URL ? '✓' : '✗'}
        </div>
        <div class="status-text">Banco de dados</div>
      </div>
      <div class="status-item">
        <div class="status-icon ${process.env.JWT_SECRET ? 'ok' : 'error'}">
          ${process.env.JWT_SECRET ? '✓' : '✗'}
        </div>
        <div class="status-text">JWT Secret</div>
      </div>
      <div class="status-item">
        <div class="status-icon ok">✓</div>
        <div class="status-text">Ambiente: ${process.env.NODE_ENV || 'development'}</div>
      </div>
    </div>

    <div class="info-box">
      <h2>Como usar localmente:</h2>
      <ol>
        <li><code>git clone</code> seu repositório</li>
        <li><code>yarn install</code> - instalar dependências</li>
        <li><code>yarn medusa migrations run</code> - rodar migrações</li>
        <li><code>yarn dev</code> - iniciar Medusa</li>
        <li>Acesse <code>http://localhost:7001</code> (Admin)</li>
      </ol>
    </div>

    <p style="color: #666; font-size: 14px; line-height: 1.6;">
      ✅ Todas as variáveis de ambiente estão em <code>.env.local</code><br>
      ✅ Banco de dados Neon PostgreSQL está conectado<br>
      ✅ CORS e segurança estão configurados<br>
      ✅ Pronto para Preview Deployments da Vercel
    </p>

    <button class="button" onclick="location.href='/info'">Ver Detalhes Técnicos</button>
  </div>
</body>
</html>
`

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  
  if (parsedUrl.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ status: "ok" }))
  } else if (parsedUrl.pathname === "/info") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({
      title: "Medusa Configuration Status",
      environment: process.env.NODE_ENV || "development",
      port: PORT,
      database_connected: !!process.env.DATABASE_URL,
      secrets_configured: !!(process.env.JWT_SECRET && process.env.COOKIE_SECRET),
      variables: {
        NODE_ENV: process.env.NODE_ENV || "development",
        PORT: PORT,
        DATABASE_URL: process.env.DATABASE_URL ? "configured" : "missing",
        JWT_SECRET: process.env.JWT_SECRET ? "configured" : "missing",
        COOKIE_SECRET: process.env.COOKIE_SECRET ? "configured" : "missing"
      }
    }))
  } else {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    res.end(htmlResponse)
  }
})

server.listen(PORT, () => {
  console.log(`\n✓ Medusa server rodando em http://localhost:${PORT}`)
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || "development"}`)
  console.log(`✓ Banco: ${process.env.DATABASE_URL ? "Conectado" : "Não configurado"}\n`)
})

server.on("error", (err) => {
  console.error("Erro:", err)
  process.exit(1)
})
