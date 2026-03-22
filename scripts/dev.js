#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" })
const path = require("path")

const bootstrapApp = require(path.join(__dirname, "../integration-tests/environment-helpers/bootstrap-app.js"))
