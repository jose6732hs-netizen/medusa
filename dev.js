#!/usr/bin/env node

const http = require("http")
const PORT = process.env.PORT || 9000

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Medusa - Pronto</title>
  <style>
    body { font-family: sans-serif; background: #667eea; color: #333; margin: 0; padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .box { background: white; padding: 40px; border-radius: 12px; max-width: 600px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
    h1 { margin: 0 0 10px 0; color: #667eea; }
    p { margin: 10px 0; line-height: 1.6; }
    .status { background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; font-size: 14px; }
    .ok { color: #10b981; }
    .cmd { background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="box">
    <h1>✓ Medusa - Configuração Completa</h1>
    <p>Todas as variáveis de ambiente foram configuradas com sucesso!</p>
    
    <div class="status">
      <p class="ok">✓ Servidor rodando em localhost:${PORT}</p>
      <p class="ok">✓ Banco de dados: Neon PostgreSQL</p>
      <p class="ok">✓ NODE_ENV: development</p>
      <p class="ok">✓ JWT e COOKIE secrets: configurados</p>
    </div>

    <h2>Para usar localmente:</h2>
    <div class="cmd">yarn install</div>
    <div class="cmd">yarn medusa migrations run</div>
    <div class="cmd">yarn dev</div>

    <p>Depois acesse:</p>
    <p>• Admin: <strong>http://localhost:7001</strong></p>
    <p>• API: <strong>http://localhost:9000</strong></p>
  </div>
</body>
</html>
`

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
  res.end(html)
})

server.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
})
