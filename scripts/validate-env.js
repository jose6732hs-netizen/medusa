#!/usr/bin/env node
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Carrega variáveis do .env
dotenv.config({ path: path.join(__dirname, "..", ".env") })

const NODE_ENV = process.env.NODE_ENV || "development"
const isProduction = NODE_ENV === "production"

const REQUIRED_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "COOKIE_SECRET",
  "BACKEND_URL",
  "STORE_CORS",
  "ADMIN_CORS",
  "AUTH_CORS",
]

const DANGEROUS_DEFAULTS = [
  "change-me-in-production",
  "supersecret",
  "changeme",
  "change_me",
  "TODO",
]

function log(type, message) {
  const prefix = {
    error: "✗ ERRO",
    warn: "⚠ AVISO",
    success: "✓ OK",
    info: "ℹ INFO",
  }[type]
  console.log(`${prefix}: ${message}`)
}

function validateEnv() {
  console.log(`\n📋 Validando variáveis de ambiente (${NODE_ENV})...\n`)

  let errors = []
  let warnings = []

  // Validar variáveis obrigatórias
  for (const varName of REQUIRED_VARS) {
    const value = process.env[varName]

    if (!value) {
      errors.push(`${varName} não está definido`)
      continue
    }

    // Validar secrets perigosos
    if (
      (varName === "JWT_SECRET" || varName === "COOKIE_SECRET") &&
      DANGEROUS_DEFAULTS.some((dangerous) => value.toLowerCase().includes(dangerous.toLowerCase()))
    ) {
      if (isProduction) {
        errors.push(`${varName} usa valor default perigoso: "${value.substring(0, 20)}..."`)
      } else {
        warnings.push(`${varName} usa valor default (aceito em desenvolvimento)`)
      }
    }

    // Validar comprimento de secrets
    if ((varName === "JWT_SECRET" || varName === "COOKIE_SECRET") && value.length < 32) {
      warnings.push(`${varName} tem menos de 32 caracteres (recomendado: 32+)`)
    }

    // Validar URLs
    if (varName.includes("CORS") || varName === "BACKEND_URL") {
      try {
        const url = new URL(value)
        if (isProduction && url.protocol === "http:") {
          warnings.push(`${varName} usa HTTP em produção (recomendado: HTTPS)`)
        }
        log("success", `${varName} é uma URL válida`)
      } catch {
        errors.push(`${varName} não é uma URL válida: "${value}"`)
      }
    } else {
      log("success", `${varName} está definido`)
    }
  }

  // Validar DATABASE_URL especificamente
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl) {
    try {
      new URL(dbUrl)
      if (!dbUrl.includes("postgresql")) {
        errors.push("DATABASE_URL deve ser uma URL PostgreSQL")
      }
      if (isProduction && !dbUrl.includes("sslmode=require")) {
        warnings.push("DATABASE_URL em produção deve incluir sslmode=require")
      }
      log("success", "DATABASE_URL é uma URL PostgreSQL válida")
    } catch {
      errors.push("DATABASE_URL não é uma URL válida")
    }
  }

  // Exibir avisos
  if (warnings.length > 0) {
    console.log("\n⚠ AVISOS:")
    warnings.forEach((w) => log("warn", w))
  }

  // Exibir erros
  if (errors.length > 0) {
    console.log("\n✗ ERROS:")
    errors.forEach((e) => log("error", e))
    console.log(`\n❌ Validação FALHOU com ${errors.length} erro(s)\n`)
    process.exit(1)
  }

  console.log("\n✓ Validação PASSOU com sucesso!\n")
  process.exit(0)
}

// Executar validação
validateEnv()
