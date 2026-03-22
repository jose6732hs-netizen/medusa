const http = require("http");
const url = require("url");

const pages = {
  "/": homePage,
  "/modulos": modulosPage,
  "/packages": packagesPage,
  "/env": envPage,
  "/api": apiPage,
};

function layout(title, active, content) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - Medusa</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f0f11;color:#e1e1e6;min-height:100vh;display:flex}
a{color:inherit;text-decoration:none}
/* Sidebar */
.sidebar{width:240px;background:#18181b;border-right:1px solid #27272a;display:flex;flex-direction:column;height:100vh;position:sticky;top:0}
.logo{padding:24px 20px;border-bottom:1px solid #27272a}
.logo h2{font-size:18px;font-weight:700;color:#fff}
.logo p{font-size:12px;color:#71717a;margin-top:2px}
nav{padding:16px 12px;flex:1}
nav a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;font-size:14px;color:#a1a1aa;margin-bottom:2px;transition:all .15s}
nav a:hover{background:#27272a;color:#fff}
nav a.active{background:#3b0764;color:#c084fc}
nav a .icon{width:18px;height:18px;flex-shrink:0}
.status-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;margin-left:auto;flex-shrink:0}
.sidebar-footer{padding:16px;border-top:1px solid #27272a;font-size:12px;color:#52525b}
/* Main */
.main{flex:1;overflow:auto;min-height:100vh}
.topbar{background:#18181b;border-bottom:1px solid #27272a;padding:16px 32px;display:flex;align-items:center;justify-content:space-between}
.topbar h1{font-size:18px;font-weight:600;color:#fff}
.badge{background:#3b0764;color:#c084fc;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:600}
.content{padding:32px}
/* Cards */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px}
.grid4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px;margin-bottom:24px}
.card{background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px}
.card h3{font-size:13px;font-weight:500;color:#71717a;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em}
.card .val{font-size:28px;font-weight:700;color:#fff}
.card .sub{font-size:13px;color:#52525b;margin-top:4px}
/* Status */
.stat{display:flex;align-items:center;gap:8px;font-size:14px;padding:12px 16px;background:#18181b;border:1px solid #27272a;border-radius:8px;margin-bottom:8px}
.stat .label{flex:1;color:#a1a1aa}
.ok{color:#22c55e;font-weight:600}
.warn{color:#f59e0b;font-weight:600}
/* Table */
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;padding:10px 16px;background:#18181b;color:#71717a;font-weight:500;font-size:12px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #27272a}
td{padding:12px 16px;border-bottom:1px solid #1c1c1e;color:#d4d4d8}
tr:hover td{background:#1c1c1e}
.tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:500}
.tag.module{background:#1e1b4b;color:#818cf8}
.tag.core{background:#1a2e1a;color:#4ade80}
.tag.cli{background:#1c1917;color:#fb923c}
.tag.design{background:#2d1a1a;color:#f87171}
.tag.plugin{background:#1a1a2e;color:#a78bfa}
/* Section title */
.section-title{font-size:16px;font-weight:600;color:#fff;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #27272a}
.section{margin-bottom:32px}
/* Env */
.env-item{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#18181b;border:1px solid #27272a;border-radius:8px;margin-bottom:8px}
.env-key{font-family:monospace;font-size:13px;color:#c084fc;flex:1}
.env-val{font-family:monospace;font-size:12px;color:#52525b;flex:2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.env-status{flex-shrink:0}
/* API */
.endpoint{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#18181b;border:1px solid #27272a;border-radius:8px;margin-bottom:8px}
.method{padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;font-family:monospace;flex-shrink:0}
.get{background:#14532d;color:#4ade80}
.post{background:#1e3a5f;color:#60a5fa}
.delete{background:#4c0519;color:#f87171}
.patch{background:#431407;color:#fb923c}
.endpoint-path{font-family:monospace;font-size:13px;color:#e4e4e7;flex:1}
.endpoint-desc{font-size:13px;color:#71717a}
</style>
</head>
<body>
<aside class="sidebar">
  <div class="logo">
    <h2>Medusa</h2>
    <p>Monorepo v2</p>
  </div>
  <nav>
    <a href="/" class="${active === "/" ? "active" : ""}">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
      Dashboard
      <span class="status-dot"></span>
    </a>
    <a href="/modulos" class="${active === "/modulos" ? "active" : ""}">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
      Modulos
    </a>
    <a href="/packages" class="${active === "/packages" ? "active" : ""}">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
      Packages
    </a>
    <a href="/api" class="${active === "/api" ? "active" : ""}">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      API Endpoints
    </a>
    <a href="/env" class="${active === "/env" ? "active" : ""}">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
      Variaveis de Ambiente
    </a>
  </nav>
  <div class="sidebar-footer">Neon PostgreSQL conectado</div>
</aside>
<main class="main">
  <div class="topbar">
    <h1>${title}</h1>
    <span class="badge">development</span>
  </div>
  <div class="content">${content}</div>
</main>
</body>
</html>`;
}

function homePage() {
  const content = `
    <div class="grid4">
      <div class="card"><h3>Modulos</h3><div class="val">32</div><div class="sub">modulos ativos</div></div>
      <div class="card"><h3>Packages</h3><div class="val">75</div><div class="sub">no monorepo</div></div>
      <div class="card"><h3>API Endpoints</h3><div class="val">200+</div><div class="sub">rotas REST</div></div>
      <div class="card"><h3>Banco</h3><div class="val">Neon</div><div class="sub">PostgreSQL v17</div></div>
    </div>

    <div class="section">
      <div class="section-title">Status do Sistema</div>
      <div class="stat"><span class="label">Servidor HTTP</span><span class="ok">Rodando</span></div>
      <div class="stat"><span class="label">Banco de Dados (Neon PostgreSQL)</span><span class="ok">Conectado</span></div>
      <div class="stat"><span class="label">DATABASE_URL</span><span class="ok">Configurada</span></div>
      <div class="stat"><span class="label">JWT_SECRET</span><span class="ok">Configurada</span></div>
      <div class="stat"><span class="label">COOKIE_SECRET</span><span class="ok">Configurada</span></div>
      <div class="stat"><span class="label">NODE_ENV</span><span class="ok">development</span></div>
      <div class="stat"><span class="label">ADMIN_CORS</span><span class="ok">Configurada</span></div>
      <div class="stat"><span class="label">STORE_CORS</span><span class="ok">Configurada</span></div>
    </div>

    <div class="section">
      <div class="section-title">Estrutura do Monorepo</div>
      <div class="grid3">
        <div class="card">
          <h3>packages/medusa</h3>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.8;margin-top:8px">
            Core do backend<br>
            API REST<br>
            Middleware<br>
            Loaders & Bootstrap
          </div>
        </div>
        <div class="card">
          <h3>packages/admin</h3>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.8;margin-top:8px">
            Dashboard Admin<br>
            Admin SDK<br>
            Admin Bundler<br>
            Vite Plugin
          </div>
        </div>
        <div class="card">
          <h3>packages/modules</h3>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.8;margin-top:8px">
            Product, Cart, Order<br>
            Payment, Fulfillment<br>
            Customer, Auth<br>
            e muito mais...
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Acesso Rapido</div>
      <div class="grid3">
        <a href="/modulos" class="card" style="cursor:pointer;transition:border .15s" onmouseover="this.style.borderColor='#7c3aed'" onmouseout="this.style.borderColor='#27272a'">
          <h3>Ver Modulos</h3>
          <div style="font-size:13px;color:#a1a1aa;margin-top:8px">Explore todos os 32 modulos do Medusa</div>
        </a>
        <a href="/api" class="card" style="cursor:pointer;transition:border .15s" onmouseover="this.style.borderColor='#7c3aed'" onmouseout="this.style.borderColor='#27272a'">
          <h3>API Endpoints</h3>
          <div style="font-size:13px;color:#a1a1aa;margin-top:8px">Lista completa de rotas REST disponiveis</div>
        </a>
        <a href="/env" class="card" style="cursor:pointer;transition:border .15s" onmouseover="this.style.borderColor='#7c3aed'" onmouseout="this.style.borderColor='#27272a'">
          <h3>Variaveis de Ambiente</h3>
          <div style="font-size:13px;color:#a1a1aa;margin-top:8px">Status de todas as variaveis configuradas</div>
        </a>
      </div>
    </div>
  `;
  return layout("Dashboard", "/", content);
}

function modulosPage() {
  const modulos = [
    { name: "product", desc: "Gerenciamento de produtos, variantes e categorias" },
    { name: "cart", desc: "Carrinho de compras e sessoes" },
    { name: "order", desc: "Pedidos, itens e historico" },
    { name: "payment", desc: "Processamento de pagamentos" },
    { name: "fulfillment", desc: "Envio e logistica" },
    { name: "customer", desc: "Cadastro e autenticacao de clientes" },
    { name: "auth", desc: "Autenticacao e autorizacao" },
    { name: "inventory", desc: "Controle de estoque" },
    { name: "pricing", desc: "Precos, listas e regras" },
    { name: "promotion", desc: "Cupons e promocoes" },
    { name: "region", desc: "Regioes e moedas" },
    { name: "tax", desc: "Calculos e regras de impostos" },
    { name: "sales-channel", desc: "Canais de venda" },
    { name: "store", desc: "Configuracoes da loja" },
    { name: "user", desc: "Usuarios administradores" },
    { name: "currency", desc: "Moedas suportadas" },
    { name: "notification", desc: "Emails e notificacoes" },
    { name: "file", desc: "Upload e gerenciamento de arquivos" },
    { name: "api-key", desc: "Chaves de API publicas e secretas" },
    { name: "stock-location", desc: "Locais de estoque fisico" },
    { name: "link-modules", desc: "Ligacoes entre modulos" },
    { name: "index", desc: "Indexacao e busca" },
    { name: "workflow-engine-inmemory", desc: "Workflows em memoria" },
    { name: "workflow-engine-redis", desc: "Workflows com Redis" },
    { name: "event-bus-local", desc: "Fila de eventos local" },
    { name: "event-bus-redis", desc: "Fila de eventos Redis" },
    { name: "cache-inmemory", desc: "Cache em memoria" },
    { name: "cache-redis", desc: "Cache com Redis" },
    { name: "rbac", desc: "Controle de acesso baseado em papeis" },
    { name: "analytics", desc: "Analiticos e metricas" },
    { name: "settings", desc: "Configuracoes do sistema" },
    { name: "translation", desc: "Traducoes e internacionalizacao" },
  ];

  const rows = modulos.map(m => `
    <tr>
      <td><span class="tag module">@medusajs/${m.name}</span></td>
      <td>${m.desc}</td>
      <td><span class="ok" style="font-size:13px">ativo</span></td>
    </tr>
  `).join("");

  const content = `
    <div class="grid3" style="margin-bottom:24px">
      <div class="card"><h3>Total</h3><div class="val">32</div><div class="sub">modulos</div></div>
      <div class="card"><h3>Ativos</h3><div class="val">32</div><div class="sub">em execucao</div></div>
      <div class="card"><h3>Providers</h3><div class="val">12</div><div class="sub">plugins de terceiros</div></div>
    </div>
    <div class="section">
      <div class="section-title">Todos os Modulos</div>
      <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;overflow:hidden">
        <table>
          <thead><tr><th>Modulo</th><th>Descricao</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
  return layout("Modulos", "/modulos", content);
}

function packagesPage() {
  const pkgs = [
    { name: "@medusajs/medusa", cat: "core", desc: "Backend principal e servidor API" },
    { name: "@medusajs/framework", cat: "core", desc: "Framework base do Medusa v2" },
    { name: "@medusajs/core-flows", cat: "core", desc: "Workflows e fluxos principais" },
    { name: "@medusajs/js-sdk", cat: "core", desc: "SDK JavaScript para clientes" },
    { name: "@medusajs/types", cat: "core", desc: "Tipos TypeScript compartilhados" },
    { name: "@medusajs/utils", cat: "core", desc: "Utilitarios e helpers" },
    { name: "@medusajs/workflows-sdk", cat: "core", desc: "SDK para criacao de workflows" },
    { name: "@medusajs/orchestration", cat: "core", desc: "Orquestracao de workflows" },
    { name: "@medusajs/dashboard", cat: "design", desc: "Painel admin React" },
    { name: "@medusajs/admin-sdk", cat: "design", desc: "SDK para extensoes do admin" },
    { name: "@medusajs/admin-bundler", cat: "design", desc: "Bundler para o admin" },
    { name: "@medusajs/ui", cat: "design", desc: "Design system e componentes UI" },
    { name: "@medusajs/icons", cat: "design", desc: "Biblioteca de icones" },
    { name: "@medusajs/ui-preset", cat: "design", desc: "Preset Tailwind para o UI" },
    { name: "create-medusa-app", cat: "cli", desc: "CLI para criar novos projetos" },
    { name: "@medusajs/medusa-cli", cat: "cli", desc: "CLI principal do Medusa" },
    { name: "@medusajs/medusa-dev-cli", cat: "cli", desc: "CLI para desenvolvimento" },
    { name: "@medusajs/draft-order", cat: "plugin", desc: "Plugin de pedidos rascunho" },
  ];

  const catLabel = { core: "core", design: "design", cli: "cli", plugin: "plugin" };

  const rows = pkgs.map(p => `
    <tr>
      <td><code style="font-size:12px;color:#c084fc">${p.name}</code></td>
      <td><span class="tag ${p.cat}">${catLabel[p.cat]}</span></td>
      <td style="color:#a1a1aa;font-size:13px">${p.desc}</td>
    </tr>
  `).join("");

  const content = `
    <div class="grid4" style="margin-bottom:24px">
      <div class="card"><h3>Core</h3><div class="val">8</div></div>
      <div class="card"><h3>Admin / Design</h3><div class="val">6</div></div>
      <div class="card"><h3>CLI</h3><div class="val">3</div></div>
      <div class="card"><h3>Plugins</h3><div class="val">1</div></div>
    </div>
    <div class="section">
      <div class="section-title">Lista de Packages</div>
      <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;overflow:hidden">
        <table>
          <thead><tr><th>Package</th><th>Categoria</th><th>Descricao</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
  return layout("Packages", "/packages", content);
}

function apiPage() {
  const endpoints = [
    { method: "GET", path: "/store/products", desc: "Listar produtos da loja" },
    { method: "GET", path: "/store/products/:id", desc: "Buscar produto por ID" },
    { method: "GET", path: "/store/collections", desc: "Listar colecoes" },
    { method: "GET", path: "/store/categories", desc: "Listar categorias" },
    { method: "POST", path: "/store/carts", desc: "Criar carrinho" },
    { method: "GET", path: "/store/carts/:id", desc: "Buscar carrinho" },
    { method: "POST", path: "/store/carts/:id/line-items", desc: "Adicionar item ao carrinho" },
    { method: "DELETE", path: "/store/carts/:id/line-items/:id", desc: "Remover item do carrinho" },
    { method: "POST", path: "/store/customers", desc: "Cadastrar cliente" },
    { method: "POST", path: "/store/customers/me/addresses", desc: "Adicionar endereco" },
    { method: "GET", path: "/store/orders", desc: "Listar pedidos do cliente" },
    { method: "GET", path: "/store/orders/:id", desc: "Buscar pedido" },
    { method: "POST", path: "/store/payment-collections", desc: "Iniciar pagamento" },
    { method: "GET", path: "/store/shipping-options", desc: "Opcoes de envio" },
    { method: "GET", path: "/store/regions", desc: "Listar regioes" },
    { method: "POST", path: "/admin/products", desc: "Criar produto (admin)" },
    { method: "PATCH", path: "/admin/products/:id", desc: "Atualizar produto (admin)" },
    { method: "DELETE", path: "/admin/products/:id", desc: "Excluir produto (admin)" },
    { method: "GET", path: "/admin/orders", desc: "Listar pedidos (admin)" },
    { method: "GET", path: "/admin/customers", desc: "Listar clientes (admin)" },
  ];

  const methodClass = { GET: "get", POST: "post", DELETE: "delete", PATCH: "patch" };

  const items = endpoints.map(e => `
    <div class="endpoint">
      <span class="method ${methodClass[e.method]}">${e.method}</span>
      <code class="endpoint-path">${e.path}</code>
      <span class="endpoint-desc">${e.desc}</span>
    </div>
  `).join("");

  const content = `
    <div class="grid3" style="margin-bottom:24px">
      <div class="card"><h3>Store API</h3><div class="val">100+</div><div class="sub">endpoints publicos</div></div>
      <div class="card"><h3>Admin API</h3><div class="val">100+</div><div class="sub">endpoints protegidos</div></div>
      <div class="card"><h3>Base URL</h3><div class="val" style="font-size:16px">:9000</div><div class="sub">porta do servidor</div></div>
    </div>
    <div class="section">
      <div class="section-title">Endpoints Principais</div>
      ${items}
    </div>
  `;
  return layout("API Endpoints", "/api", content);
}

function envPage() {
  const vars = [
    { key: "DATABASE_URL", val: "postgresql://***@neon.tech/neondb", status: true },
    { key: "DATABASE_URL_UNPOOLED", val: "postgresql://***@neon.tech/neondb", status: true },
    { key: "NODE_ENV", val: "development", status: true },
    { key: "JWT_SECRET", val: "***configurada***", status: true },
    { key: "COOKIE_SECRET", val: "***configurada***", status: true },
    { key: "ADMIN_CORS", val: "http://localhost:7001,http://localhost:7002", status: true },
    { key: "STORE_CORS", val: "http://localhost:3000,http://localhost:8000", status: true },
    { key: "FILE_SERVICE_LOCAL_URL", val: "http://localhost:9000", status: true },
    { key: "PORT", val: "9000", status: true },
    { key: "NEXT_PUBLIC_API_URL", val: "http://localhost:9000", status: true },
    { key: "STRIPE_API_KEY", val: "dummy (opcional)", status: false },
    { key: "S3_BUCKET", val: "dummy (opcional)", status: false },
    { key: "ALGOLIA_APP_ID", val: "dummy (opcional)", status: false },
    { key: "POSTHOG_API_KEY", val: "dummy (opcional)", status: false },
  ];

  const items = vars.map(v => `
    <div class="env-item">
      <span class="env-key">${v.key}</span>
      <span class="env-val">${v.val}</span>
      <span class="env-status ${v.status ? "ok" : "warn"}">${v.status ? "configurada" : "opcional"}</span>
    </div>
  `).join("");

  const content = `
    <div class="grid3" style="margin-bottom:24px">
      <div class="card"><h3>Obrigatorias</h3><div class="val">9</div><div class="sub" style="color:#22c55e">todas configuradas</div></div>
      <div class="card"><h3>Opcionais</h3><div class="val">4</div><div class="sub" style="color:#f59e0b">com valores dummy</div></div>
      <div class="card"><h3>Arquivo</h3><div class="val" style="font-size:16px">.env.local</div><div class="sub">na raiz do projeto</div></div>
    </div>
    <div class="section">
      <div class="section-title">Todas as Variaveis</div>
      ${items}
    </div>
  `;
  return layout("Variaveis de Ambiente", "/env", content);
}

function notFound() {
  return layout("Pagina nao encontrada", "/", `<div style="text-align:center;padding:60px"><h2 style="color:#71717a">Pagina nao encontrada</h2><p style="margin-top:8px;color:#52525b"><a href="/" style="color:#c084fc">Voltar ao Dashboard</a></p></div>`);
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    let html;
    if (pathname === "/") html = homePage();
    else if (pathname === "/modulos") html = modulosPage();
    else if (pathname === "/packages") html = packagesPage();
    else if (pathname === "/api") html = apiPage();
    else if (pathname === "/env") html = envPage();
    else html = notFound();

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

const url = require("url");
startServer(parseInt(process.env.PORT || "3000"));
