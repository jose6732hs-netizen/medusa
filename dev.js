#!/usr/bin/env node

/**
 * Simple development starter
 * Uses the existing Medusa bootstrap helper from integration tests
 */

require("dotenv").config({ path: ".env.local" })

// Run the bootstrap from integration tests
require("./integration-tests/environment-helpers/bootstrap-app.js")
