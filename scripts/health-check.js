#!/usr/bin/env node
import http from "http"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000"
const HEALTH_CHECK_PATH = "/health"

console.log(`\n🏥 Health Check: Testando ${BACKEND_URL}${HEALTH_CHECK_PATH}...\n`)

const url = new URL(HEALTH_CHECK_PATH, BACKEND_URL)

const request = http.request(url, { timeout: 5000 }, (res) => {
  let data = ""

  res.on("data", (chunk) => {
    data += chunk
  })

  res.on("end", () => {
    try {
      const health = JSON.parse(data)
      const statusEmoji = res.statusCode === 200 ? "✓" : "✗"
      const statusText = res.statusCode === 200 ? "SAUDÁVEL" : "NÃO SAUDÁVEL"

      console.log(`${statusEmoji} Status: ${statusText}`)
      console.log(`  HTTP Status: ${res.statusCode}`)
      console.log(`  Health Status: ${health.status}`)
      console.log(`  Timestamp: ${health.timestamp}`)
      console.log(`  Uptime: ${Math.round(health.uptime)}s`)
      console.log(`  Environment: ${health.environment}`)

      process.exit(res.statusCode === 200 ? 0 : 1)
    } catch (error) {
      console.error(`✗ Erro ao parsear resposta: ${error.message}`)
      process.exit(1)
    }
  })
})

request.on("error", (error) => {
  console.error(`✗ Erro na conexão: ${error.message}`)
  console.error(`  Verifique se o servidor está rodando em ${BACKEND_URL}`)
  process.exit(1)
})

request.on("timeout", () => {
  request.destroy()
  console.error(`✗ Timeout: Servidor não respondeu em 5 segundos`)
  process.exit(1)
})

request.end()
