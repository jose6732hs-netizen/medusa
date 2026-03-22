#!/usr/bin/env node

/**
 * Medusa Development Server
 * Simple starter that initializes Medusa with environment configuration
 */

require("dotenv").config({ path: ".env.local" })

const path = require("path")
const PORT = process.env.PORT || 9000

console.log("\n[Medusa] Starting development server...")
console.log("[Medusa] Loading environment variables...")
console.log(`[Medusa] PORT: ${PORT}`)
console.log(`[Medusa] NODE_ENV: ${process.env.NODE_ENV || "development"}\n`)

try {
  // Load and run the bootstrap helper that already exists in the repo
  const bootstrapPath = path.join(__dirname, "integration-tests", "environment-helpers", "bootstrap-app.js")
  console.log(`[Medusa] Loading bootstrap from: ${bootstrapPath}`)
  
  require(bootstrapPath)
} catch (error) {
  console.error("[Medusa] Error starting server:", error.message)
  process.exit(1)
}
