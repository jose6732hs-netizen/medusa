#!/usr/bin/env node
require("dotenv").config({ path: ".env.local" })
const path = require("path")

console.log("[Medusa Dev] Initializing...\n")

// Import and run bootstrap
try {
  const bootstrap = require(path.join(__dirname, "integration-tests/environment-helpers/bootstrap-app.js"))
} catch (e) {
  console.error("[Medusa Dev] Error:", e.message)
  process.exit(1)
}
