export default function handler(req, res) {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isProduction = NODE_ENV === "production";

  // Health check endpoint
  if (req.url === "/health" || req.url === "/api/health") {
    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      uptime: process.uptime(),
    });
  }

  // Página principal com info do Medusa
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medusa SaaS Multi-Tenant</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 60px 40px;
            max-width: 600px;
            text-align: center;
          }
          h1 {
            color: #333;
            font-size: 2.5em;
            margin-bottom: 20px;
          }
          .subtitle {
            color: #667eea;
            font-size: 1.2em;
            margin-bottom: 30px;
            font-weight: 600;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
            text-align: left;
          }
          .info-item {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
          }
          .info-label {
            color: #667eea;
            font-weight: 600;
            font-size: 0.9em;
            text-transform: uppercase;
          }
          .info-value {
            color: #333;
            font-size: 1.1em;
            margin-top: 5px;
          }
          .endpoints {
            margin-top: 30px;
            text-align: left;
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .endpoints h3 {
            color: #333;
            margin-bottom: 15px;
          }
          .endpoint {
            background: white;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #667eea;
            word-break: break-all;
          }
          .status-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Medusa SaaS</h1>
          <div class="subtitle">Multi-Tenant E-Commerce Platform</div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Environment</div>
              <div class="info-value">${NODE_ENV}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value">Online ✓</div>
            </div>
            <div class="info-item">
              <div class="info-label">Database</div>
              <div class="info-value">PostgreSQL Neon</div>
            </div>
            <div class="info-item">
              <div class="info-label">Uptime</div>
              <div class="info-value">${Math.round(process.uptime())}s</div>
            </div>
          </div>

          <div class="endpoints">
            <h3>Available Endpoints</h3>
            <div class="endpoint">GET /</div>
            <div class="endpoint">GET /health</div>
            <div class="endpoint">GET /api/health</div>
          </div>

          <div class="status-badge">✓ Backend Operacional</div>
        </div>
      </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
