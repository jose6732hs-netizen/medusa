# 📝 Guia de Controle de Versão - Git

## 🚀 Primeiros Passos com Git

### Inicializar Repositório (Se não tiver)

```bash
git init
git add .
git commit -m "Initial commit - Medusa ECommerce complete"
```

### Conectar ao GitHub

```bash
git remote add origin https://github.com/seu-usuario/medusa-ecommerce.git
git branch -M main
git push -u origin main
```

---

## 📋 Estrutura de Branches

```
main (production)
  ├── staging (homologação)
  └── develop (desenvolvimento)
       ├── feature/stripe-integration
       ├── feature/email-notifications
       ├── fix/cart-bug
       └── ...
```

### Workflow Recomendado

```bash
# 1. Crie branch para sua feature
git checkout -b feature/sua-feature

# 2. Faça changes
git add .
git commit -m "Descrição da mudança"

# 3. Push para o repositório
git push origin feature/sua-feature

# 4. Crie Pull Request no GitHub
# GitHub UI → New Pull Request

# 5. Depois de revisar, merge para develop
git checkout develop
git merge feature/sua-feature
git push origin develop

# 6. Deploy para staging

# 7. Se tudo OK, merge para main
git checkout main
git merge develop
git push origin main

# 8. Deploy para produção

# 9. Delete branch local
git branch -d feature/sua-feature
```

---

## 💬 Convenção de Commits

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos

- **feat**: Nova feature
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação, sem mudança lógica
- **refactor**: Refatoração sem mudança funcional
- **perf**: Performance
- **test**: Testes
- **chore**: Build, dependências, etc

### Exemplos

```bash
# Feature
git commit -m "feat(cart): add remove item button"

# Bug fix
git commit -m "fix(checkout): fix address validation"

# Documentation
git commit -m "docs(readme): update setup instructions"

# Refactor
git commit -m "refactor(api): simplify product query"

# Performance
git commit -m "perf(database): add index to orders table"
```

---

## 🔄 Trabalho em Equipe

### Clone Repositório

```bash
git clone https://github.com/seu-usuario/medusa-ecommerce.git
cd medusa-ecommerce
```

### Atualize Regularmente

```bash
# Do seu branch de feature
git fetch origin
git rebase origin/main

# Ou merge
git merge origin/main
```

### Resolve Conflitos

```bash
# Se houver conflitos
# 1. Abra os arquivos em conflito
# 2. Escolha as mudanças desejadas
# 3. Remove marcadores (<<<<, ====, >>>>)
git add arquivo-resolvido.ts
git commit -m "resolve merge conflict"
```

---

## 📊 Histórico e Status

```bash
# Ver histórico de commits
git log --oneline
git log --oneline --graph --all

# Ver status
git status

# Ver mudanças não commitadas
git diff

# Ver mudanças staged
git diff --staged

# Ver commits em um branch
git log main..feature/seu-feature

# Ver branches
git branch -a

# Ver remote
git remote -v
```

---

## 🔙 Desfazendo Mudanças

```bash
# Desfaz changes em arquivo
git checkout -- arquivo.ts

# Unstage arquivo
git reset arquivo.ts

# Reverte último commit (mantém mudanças)
git reset --soft HEAD~1

# Reverte último commit (descarta mudanças)
git reset --hard HEAD~1

# Reverte um commit específico
git revert abc1234

# Ver histórico de deletions
git reflog
```

---

## 🐛 Debugging com Git

### Encontre o commit que quebrou

```bash
# Binary search através dos commits
git bisect start
git bisect bad HEAD
git bisect good abc1234
# Continua apontando good/bad até encontrar
```

### Blame - Quem fez cada linha?

```bash
git blame arquivo.ts

# Com mais detalhes
git blame -L 10,20 arquivo.ts
```

### Cherry-pick

```bash
# Aplique um commit específico
git cherry-pick abc1234

# De outro branch
git cherry-pick origin/develop~2
```

---

## 📦 Tags e Releases

```bash
# Criar tag
git tag v1.0.0
git push origin v1.0.0

# Listar tags
git tag

# Deletar tag
git tag -d v1.0.0
git push origin --delete v1.0.0

# Tag anotada (com mensagem)
git tag -a v1.0.0 -m "Release 1.0.0"
```

---

## 🚀 GitHub Actions (CI/CD)

### Criar workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      run: npm run deploy
```

---

## 💾 Boas Práticas

### ✅ Faça

- ✅ Commit com frequência (1-2x por dia)
- ✅ Mensagens descritivas
- ✅ Pull antes de Push
- ✅ Uma feature por branch
- ✅ Code review antes de merge

### ❌ Não Faça

- ❌ Commit de `.env.local`
- ❌ Commit de `node_modules`
- ❌ Commits muito grandes (> 50 arquivos)
- ❌ Push diretamente para `main`
- ❌ Merge sem revisar mudanças

---

## 🛡️ .gitignore

Seu `.gitignore` deve conter:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Environment
.env.local
.env.*.local

# Build
/.next
/build
/dist
*.tsbuildinfo

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*

# Database
*.db
*.sqlite

# Misc
.cache
.prettierignore
```

---

## 📱 Comandos Úteis Rápidos

```bash
# Setup rápido
git init && git add . && git commit -m "Initial"

# Status resumido
git status -s

# Ver mudanças em arquivo específico
git diff arquivo.ts

# Ver mudanças em um commit
git show abc1234

# Amend último commit
git commit --amend --no-edit

# Squash commits
git rebase -i HEAD~3

# Stash mudanças (guardar para depois)
git stash
git stash pop

# Clone shallow (mais rápido)
git clone --depth=1 url

# Sync fork com upstream
git fetch upstream
git rebase upstream/main
git push origin main
```

---

## 🔐 Segurança

### SSH Setup

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu-email@example.com"

# Copiar public key
cat ~/.ssh/id_ed25519.pub

# Adicionar em GitHub Settings > SSH Keys

# Testar conexão
ssh -T git@github.com
```

---

## 🆘 Problemas Comuns

### Erro: "Permission denied (publickey)"

```bash
# Solução: Configure SSH corretamente
ssh-keygen -t ed25519
# Adicione a public key no GitHub
```

### Erro: "Diverged branches"

```bash
# Solução: Rebase seu branch
git pull origin main --rebase
```

### Erro: "Merge conflict"

```bash
# Solução: Resolva manualmente e commit
# (Ver seção "Resolve Conflitos" acima)
```

### Deletei um commit acidentalmente

```bash
# Solução: Use reflog
git reflog
git reset --hard abc1234
```

---

## 📚 Recursos

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guide](https://guides.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git)
- [Oh My Git](https://ohmygit.org/)

---

**Bom controle de versão! 📚**
