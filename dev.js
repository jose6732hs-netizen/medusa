const http = require("http");
const PORT = process.env.PORT || 9000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<html><body style="font-family:sans-serif;padding:40px;"><h1>✓ Medusa</h1><p>Servidor rodando!</p></body></html>`);
}).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
