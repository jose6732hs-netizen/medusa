const { defineConfig, Modules } = require("@medusajs/utils")

module.exports = defineConfig({
  projectConfig: {
    // Database PostgreSQL (Neon)
    databaseUrl: process.env.DATABASE_URL,
    
    http: {
      // CORS para loja cliente (frontend)
      storeCors: process.env.STORE_CORS || "http://localhost:3001",
      
      // CORS para admin dashboard
      adminCors: process.env.ADMIN_CORS || "http://localhost:3002",
      
      // CORS para servicos de auth
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
      
      // Segredos - MUDE EM PRODUCAO
      jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
      cookieSecret: process.env.COOKIE_SECRET || "change-me-in-production",
    },
  },
  
  admin: {
    // URL do backend para o admin acessar
    backendUrl: process.env.BACKEND_URL || "http://localhost:3000",
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
