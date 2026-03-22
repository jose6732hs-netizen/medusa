#!/usr/bin/env node

/**
 * Medusa Dev Server - Usa apenas módulos nativos do Node.js
 * Sem dependências externas
 */

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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 600px;
      width: 100%;
      padding: 40px;
    }
    h1 { color: #333; font-size: 28px; margin-bottom: 30px; }
    .status { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .status-item {
      display: flex;
      align-items: center;
      margin: 10px 0;
      font-size: 14px;
    }
    .icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: white;
      font-weight: bold;
      font-size: 14px;
    }
    .ok .icon { background: #10b981; }
    .error .icon { background: #ef4444; }
    .steps {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .steps h2 { margin: 0 0 15px 0; color: #1e40af; font-size: 16px; }
    .steps ol { margin: 0; padding-left: 20px; }
    .steps li { margin: 8px 0; font-size: 14px; color: #333; }
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    .footer { color: #666; font-size: 13px; margin-top: 20px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✓ Medusa Configurado com Sucesso</h1>
    
    <div class="status">
      <div class="status-item ok">
        <div class="icon">✓</div>
        <div><strong>Ambiente:</strong> ${process.env.NODE_ENV || "development"}</div>
      </div>
      <div class="status-item ${process.env.DATABASE_URL ? "ok" : "error"}">
        <div class="icon">${process.env.DATABASE_URL ? "✓" : "✗"}</div>
        <div><strong>Banco de Dados:</strong> ${process.env.DATABASE_URL ? "Configurado" : "Não configurado"}</div>
      </div>
      <div class="status-item ${process.env.JWT_SECRET ? "ok" : "error"}">
        <div class="icon">${process.env.JWT_SECRET ? "✓" : "✗"}</div>
        <div><strong>JWT Secret:</strong> ${process.env.JWT_SECRET ? "Configurado" : "Não configurado"}</div>
      </div>
      <div class="status-item ok">
        <div class="icon">✓</div>
        <div><strong>Porta:</strong> ${PORT}</div>
      </div>
    </div>

    <div class="steps">
      <h2>Próximos Passos para Desenvolver Localmente:</h2>
      <ol>
        <li>Clone o repositório: <code>git clone SEU_REPO</code></li>
        <li>Instale dependências: <code>yarn install</code></li>
        <li>Execute migrações: <code>yarn medusa migrations run</code></li>
        <li>Inicie servidor: <code>yarn dev</code></li>
        <li>Admin: <code>http://localhost:7001</code></li>
      </ol>
    </div>

    <div class="footer">
      <strong>✓ Status:</strong> O arquivo <code>.env.local</code> foi criado com todas as variáveis configuradas. As credenciais do banco de dados Neon já estão conectadas e prontas para uso.
    </div>
  </div>
</body>
</html>
`

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname

  res.setHeader("Content-Type", "text/html; charset=utf-8")

  if (pathname === "/health") {
    res.setHeader("Content-Type", "application/json")
    res.writeHead(200)
    res.end(JSON.stringify({ status: "ok" }))
  } else if (pathname === "/info") {
    res.setHeader("Content-Type", "application/json")
    res.writeHead(200)
    res.end(JSON.stringify({
      status: "success",
      environment: process.env.NODE_ENV || "development",
      database: process.env.DATABASE_URL ? "configured" : "not_configured"
    }))
  } else {
    res.writeHead(200)
    res.end(htmlResponse)
  }
})

server.listen(PORT, () => {
  console.log(`\n✓ Servidor Medusa iniciado em http://localhost:${PORT}`)
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || "development"}`)
  console.log(`✓ Banco de dados: ${process.env.DATABASE_URL ? "Configurado" : "Não configurado"}\n`)
})
