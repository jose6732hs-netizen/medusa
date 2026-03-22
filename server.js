import http from "http"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000

// Lê a versão do medusa no workspace
function getMedusaVersion() {
  try {
    const pkgPath = path.join(__dirname, "packages", "medusa", "package.json")
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
    return pkg.version || "N/A"
  } catch {
    return "N/A"
  }
}

// Conta quantos pacotes existem no workspace
function countPackages() {
  try {
    const packagesDir = path.join(__dirname, "packages")
    const count = fs.readdirSync(packagesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory()).length
    return count
  } catch {
    return "?"
  }
}

const html = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Medusa — Repositório Fonte</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f0f0f;
      color: #e5e5e5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 2.5rem 3rem;
      max-width: 560px;
      width: 100%;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.75rem;
    }
    .logo svg { flex-shrink: 0; }
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.02em;
    }
    .badge {
      display: inline-block;
      background: #3b82f6;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      vertical-align: middle;
      margin-left: 0.5rem;
    }
    h1 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.9rem;
      color: #888;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat {
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 1rem;
    }
    .stat-label {
      font-size: 0.75rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #e5e5e5;
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.7rem 1rem;
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      color: #c3c3c3;
      text-decoration: none;
      font-size: 0.875rem;
      transition: border-color 0.15s, color 0.15s;
    }
    .link:hover {
      border-color: #3b82f6;
      color: #fff;
    }
    .link-arrow { color: #555; font-size: 1rem; }
    .note {
      margin-top: 1.75rem;
      padding: 0.75rem 1rem;
      background: #1f1a0d;
      border: 1px solid #3a2e10;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #a07a2b;
      line-height: 1.5;
    }
    code {
      font-family: "Fira Code", "Consolas", monospace;
      background: #0f0f0f;
      padding: 0.1em 0.35em;
      border-radius: 4px;
      font-size: 0.85em;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#3b82f6"/>
        <path d="M8 22L16 10L24 22H8Z" fill="white" opacity="0.9"/>
      </svg>
      <span class="logo-text">Medusa <span class="badge">Monorepo</span></span>
    </div>

    <h1>Repositorio fonte do Medusa</h1>
    <p>
      Este e o repositorio de desenvolvimento do framework Medusa v2.
      Contem o nucleo, modulos, plugins e painel admin — todos em um unico monorepo gerenciado com <code>yarn workspaces</code> e <code>turborepo</code>.
    </p>

    <div class="stats">
      <div class="stat">
        <div class="stat-label">Versao Medusa</div>
        <div class="stat-value">${getMedusaVersion()}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Diretorios em /packages</div>
        <div class="stat-value">${countPackages()}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Branch atual</div>
        <div class="stat-value" style="font-size:0.9rem;">develop</div>
      </div>
      <div class="stat">
        <div class="stat-label">Package Manager</div>
        <div class="stat-value" style="font-size:0.9rem;">yarn@3</div>
      </div>
    </div>

    <div class="links">
      <a class="link" href="https://github.com/medusajs/medusa" target="_blank" rel="noopener">
        <span>Repositorio oficial no GitHub</span>
        <span class="link-arrow">&#8599;</span>
      </a>
      <a class="link" href="https://docs.medusajs.com" target="_blank" rel="noopener">
        <span>Documentacao do Medusa</span>
        <span class="link-arrow">&#8599;</span>
      </a>
      <a class="link" href="https://medusajs.com" target="_blank" rel="noopener">
        <span>Site oficial</span>
        <span class="link-arrow">&#8599;</span>
      </a>
    </div>

    <div class="note">
      <strong>Nota:</strong> Para iniciar um projeto Medusa real, crie uma nova instancia com
      <code>npx create-medusa-app@latest</code> ou acesse o repositorio <code>jose6732hs-netizen/medusa</code>
      para contribuicoes no framework.
    </div>
  </div>
</body>
</html>`

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
  res.end(html)
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(`ready - started server on 0.0.0.0:${PORT}, url: http://localhost:${PORT}`)
})
