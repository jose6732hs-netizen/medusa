#!/usr/bin/env node

/**
 * Medusa Development Server Starter
 * 
 * Este script inicia o servidor Medusa em modo desenvolvimento
 * com todas as variáveis de ambiente configuradas.
 */

require("dotenv").config({ path: ".env.local" })

const { spawn } = require("child_process")
const path = require("path")

const NODE_ENV = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 9000

console.log("\n" + "=".repeat(60))
console.log("🚀 Iniciando Medusa Development Server")
console.log("=".repeat(60))
console.log(`📋 Ambiente: ${NODE_ENV}`)
console.log(`🔌 Porta: ${PORT}`)
console.log(`💾 Banco de Dados: ${process.env.DATABASE_URL ? "✓ Configurado" : "✗ Não configurado"}`)
console.log("=".repeat(60) + "\n")

// Validar variáveis essenciais
const requiredEnvVars = ["DATABASE_URL", "NODE_ENV", "JWT_SECRET", "COOKIE_SECRET"]
const missingVars = requiredEnvVars.filter(v => !process.env[v])

if (missingVars.length > 0) {
  console.error(`\n❌ Erro: As seguintes variáveis de ambiente são obrigatórias:`)
  missingVars.forEach(v => console.error(`   - ${v}`))
  console.error(`\n👉 Verifique o arquivo .env.local\n`)
  process.exit(1)
}

// Iniciar Medusa com turbo
const medusaProcess = spawn("yarn", ["workspace", "@medusajs/medusa", "serve"], {
  stdio: "inherit",
  cwd: path.resolve(__dirname, "..")
})

medusaProcess.on("error", (error) => {
  console.error("❌ Erro ao iniciar Medusa:", error.message)
  process.exit(1)
})

medusaProcess.on("exit", (code) => {
  console.log(`\n🛑 Servidor Medusa finalizado com código: ${code}`)
  process.exit(code)
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Recebido SIGINT, encerrando...")
  medusaProcess.kill()
})

process.on("SIGTERM", () => {
  console.log("\n🛑 Recebido SIGTERM, encerrando...")
  medusaProcess.kill()
})
