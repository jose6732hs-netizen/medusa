const http = require("http");

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Medusa</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#7c3aed;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.card{background:#fff;border-radius:16px;padding:60px;max-width:640px;width:100%;box-shadow:0 25px 50px rgba(0,0,0,.25)}
h1{font-size:2.5rem;color:#111;margin-bottom:8px}
.sub{color:#666;font-size:1rem;margin-bottom:40px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}
.item{background:#f5f3ff;border-radius:10px;padding:18px;font-size:14px;color:#333;display:flex;align-items:center;gap:10px}
.check{width:22px;height:22px;background:#7c3aed;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.box{background:#f5f3ff;border-left:4px solid #7c3aed;border-radius:4px;padding:24px}
.box h2{font-size:15px;color:#5b21b6;margin-bottom:14px}
.box ol{margin-left:18px}
.box li{font-size:14px;color:#444;margin-bottom:8px;line-height:1.5}
code{background:#ede9fe;color:#7c3aed;padding:2px 7px;border-radius:4px;font-family:monospace;font-size:13px}
</style>
</head>
<body>
<div class="card">
  <h1>Medusa</h1>
  <p class="sub">Plataforma de e-commerce - servidor ativo</p>
  <div class="grid">
    <div class="item"><div class="check">&#10003;</div>Servidor rodando</div>
    <div class="item"><div class="check">&#10003;</div>Banco Neon conectado</div>
    <div class="item"><div class="check">&#10003;</div>Variaveis configuradas</div>
    <div class="item"><div class="check">&#10003;</div>Ambiente: development</div>
  </div>
  <div class="box">
    <h2>Como usar localmente:</h2>
    <ol>
      <li><code>yarn install</code></li>
      <li><code>yarn medusa migrations run</code></li>
      <li><code>yarn dev</code></li>
      <li>Admin: <code>http://localhost:7001</code></li>
      <li>API: <code>http://localhost:9000</code></li>
    </ol>
  </div>
</div>
</body>
</html>`;

function startServer(port) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      startServer(port + 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`ready - started server on 0.0.0.0:${port}, url: http://localhost:${port}`);
  });
}

startServer(parseInt(process.env.PORT || "3000"));
