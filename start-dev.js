#!/usr/bin/env node

/**
 * Development server starter for Medusa
 * This script boots up the Medusa application with proper configuration
 */

require("dotenv").config({ path: ".env.local" })

const path = require("path")
const { bootstrap } = require("@medusajs/medusa/dist/loaders")
const express = require("express")

async function startServer() {
  try {
    console.log("[v0] Starting Medusa development server...")
    
    // Load environment variables
    const env = process.env
    
    console.log("[v0] Configuration:")
    console.log(`  NODE_ENV: ${env.NODE_ENV || "development"}`)
    console.log(`  DATABASE_URL: ${env.DATABASE_URL ? "✓ configured" : "✗ NOT SET"}`)
    console.log(`  PORT: ${env.PORT || "9000"}`)
    
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set. Please check .env.local file.")
    }
    
    const app = express()
    
    // Bootstrap Medusa
    console.log("[v0] Initializing Medusa framework...")
    
    const { container } = await bootstrap(
      path.resolve(process.cwd()),
      { app }
    )
    
    // Get port
    const PORT = parseInt(env.PORT || "9000")
    
    // Start server
    console.log("[v0] Starting Express server...")
    return await new Promise((resolve, reject) => {
      const server = app
        .listen(PORT)
        .on("error", (err) => {
          console.error("[v0] Server error:", err.message)
          reject(err)
        })
        .on("listening", () => {
          console.log(`\n✓ Medusa server running on http://localhost:${PORT}`)
          console.log(`\n  Admin Dashboard: http://localhost:7001`)
          console.log(`  Storefront: http://localhost:3000`)
          console.log(`\nPress Ctrl+C to stop\n`)
          
          const gracefulShutdown = async () => {
            console.log("\n[v0] Shutting down gracefully...")
            server.close()
            process.exit(0)
          }
          
          process.on("SIGTERM", gracefulShutdown)
          process.on("SIGINT", gracefulShutdown)
          
          resolve()
        })
    })
  } catch (error) {
    console.error("[v0] Failed to start server:", error.message)
    if (error.stack) console.error(error.stack)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error("[v0] Fatal error:", error)
    process.exit(1)
  })
}

module.exports = { startServer }
