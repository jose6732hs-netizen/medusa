#!/usr/bin/env node

/**
 * Development server starter for Medusa
 * This script boots up the Medusa application with proper configuration
 */

const path = require("path")
const getPort = require("get-port")
const express = require("express")
const { isObject } = require("@medusajs/framework/utils")

async function startServer() {
  try {
    console.log("[Medusa] Starting development server...")
    
    // Load environment variables
    const env = process.env
    
    console.log("[Medusa] Environment:")
    console.log(`  NODE_ENV: ${env.NODE_ENV || "development"}`)
    console.log(`  DATABASE_URL: ${env.DATABASE_URL ? "configured" : "NOT SET"}`)
    console.log(`  PORT: ${env.PORT || "9000"}`)
    
    const app = express()
    
    // Load Medusa loaders
    console.log("[Medusa] Loading Medusa framework...")
    const loaders = require("@medusajs/medusa/dist/loaders").default
    
    const { container, shutdown } = await loaders({
      directory: path.resolve(process.cwd()),
      expressApp: app,
      isTest: false,
    })
    
    // Get port
    const PORT = parseInt(env.PORT || "9000")
    
    // Start server
    console.log("[Medusa] Starting Express server...")
    return await new Promise((resolve, reject) => {
      const server = app
        .listen(PORT)
        .on("error", async (err) => {
          console.error("[Medusa] Server error:", err)
          await shutdown()
          reject(err)
        })
        .on("listening", () => {
          console.log(`\n✓ Medusa server running on http://localhost:${PORT}`)
          console.log(`\nAdmin: http://localhost:7001`)
          console.log(`Store: http://localhost:3000`)
          console.log("\nPress Ctrl+C to stop\n")
          
          const gracefulShutdown = async () => {
            console.log("\n[Medusa] Shutting down gracefully...")
            await Promise.all([
              new Promise(r => server.close(() => r())),
              shutdown()
            ])
            console.log("[Medusa] Server stopped")
            process.exit(0)
          }
          
          process.on("SIGTERM", gracefulShutdown)
          process.on("SIGINT", gracefulShutdown)
          
          resolve()
        })
    })
  } catch (error) {
    console.error("[Medusa] Failed to start server:", error.message)
    console.error(error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  startServer().catch(error => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
}

module.exports = { startServer }
