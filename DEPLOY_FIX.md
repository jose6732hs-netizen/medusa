CORRIGIDO: vercel.json foi simplificado

O problema era que o vercel.json estava tentando fazer "npm run build" que não existe.

Agora foi corrigido para apenas:
- npm install (instalar dependências)
- node server.js (rodar o servidor)

Aguarde o Vercel refazer o deploy automaticamente (2-5 minutos).
