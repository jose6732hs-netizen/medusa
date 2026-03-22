const { defineConfig, Modules } = require("@medusajs/utils")

const NODE_ENV = process.env.NODE_ENV || "development"
const isProduction = NODE_ENV === "production"

// Validação de variáveis críticas
function validateSecrets() {
  const jwtSecret = process.env.JWT_SECRET
  const cookieSecret = process.env.COOKIE_SECRET
  const dangerousDefaults = ["change-me-in-production", "supersecret", "changeme"]

  if (isProduction) {
    if (!jwtSecret || dangerousDefaults.includes(jwtSecret)) {
      throw new Error("PRODUÇÃO: JWT_SECRET não pode ser valor default!")
    }
    if (!cookieSecret || dangerousDefaults.includes(cookieSecret)) {
      throw new Error("PRODUÇÃO: COOKIE_SECRET não pode ser valor default!")
    }
    if (!process.env.DATABASE_URL) {
      throw new Error("PRODUÇÃO: DATABASE_URL é obrigatório!")
    }
  }
}

// Valida CORS em produção (deve usar HTTPS)
function validateCors() {
  if (!isProduction) return

  const cors = [
    process.env.STORE_CORS,
    process.env.ADMIN_CORS,
    process.env.AUTH_CORS,
  ].filter(Boolean)

  for (const url of cors) {
    if (!url.startsWith("https://") && url !== "http://localhost:3000") {
      console.warn(`AVISO: CORS URL em produção não usa HTTPS: ${url}`)
    }
  }
}

// Executar validações
validateSecrets()
validateCors()

module.exports = defineConfig({
  projectConfig: {
    // Database PostgreSQL (Neon)
    databaseUrl: process.env.DATABASE_URL,
    
    http: {
      // CORS para loja cliente (frontend)
      storeCors: process.env.STORE_CORS || (isProduction ? "" : "http://localhost:3001"),
      
      // CORS para admin dashboard
      adminCors: process.env.ADMIN_CORS || (isProduction ? "" : "http://localhost:3002"),
      
      // CORS para servicos de auth
      authCors: process.env.AUTH_CORS || (isProduction ? "" : "http://localhost:3000"),
      
      // Segredos - MUDE EM PRODUCAO
      jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
      cookieSecret: process.env.COOKIE_SECRET || "change-me-in-production",
    },
  },
  
  admin: {
    // URL do backend para o admin acessar
    backendUrl: process.env.BACKEND_URL || (isProduction ? "" : "http://localhost:3000"),
  },
  modules: {
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "uploads",
              private_upload_dir: "private-uploads",
            },
          },
        ],
      },
    },
    [Modules.NOTIFICATION]: {
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
        ],
      },
    },
  },
})
