# MultiTenant Admin Panel

Um sistema completo de gerenciamento multi-tenant com você (super admin) como proprietário central. Gerenciar tenants, usuários, permissões, faturamento e análises.

## Características

✅ **Autenticação Segura**
- JWT com cookies HTTP-only
- Bcrypt para hash de senhas
- Sessões seguras com expiração

✅ **Gerenciamento Multi-Tenant**
- Criar, editar e deletar tenants
- Subdomínios personalizados (empresa1.app.com)
- Controle de status e planos

✅ **Gerenciamento de Usuários**
- Criar usuários por tenant
- Roles: owner, admin, user, viewer
- Sistema de convites

✅ **RBAC (Role-Based Access Control)**
- Permissões granulares
- Controle por recurso e ação
- Validação em middleware

✅ **Auditoria**
- Logs de todas as ações
- Rastreamento de mudanças
- Histórico completo

✅ **Faturamento**
- Planos: Free, Starter, Pro, Enterprise
- Gestão de assinaturas
- Suporte a ciclos mensais/anuais

✅ **Análises**
- Dashboard com métricas por tenant
- Análise de crescimento
- Relatórios de uso

## Arquitetura do Banco de Dados

```
Tabelas Principais:
├── super_admins          (Administradores globais)
├── tenants              (Organizações/Empresas)
├── tenant_users         (Usuários de cada tenant)
├── tenant_invites       (Convites para usuários)
├── permissions          (Permissões do sistema)
├── role_permissions     (Mapeamento role → permission)
├── audit_logs           (Histórico de ações)
├── billing_plans        (Planos de assinatura)
├── billing_subscriptions (Assinaturas ativas)
└── tenant_analytics     (Métricas e análises)
```

## Setup Rápido

### 1. Pré-requisitos

- Node.js 18+
- Neon (PostgreSQL serverless)
- npm ou pnpm

### 2. Clonar e Instalar

```bash
cd packages/multitenant-admin
cp .env.example .env.local
```

### 3. Configurar Environment

Edite `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=sua-chave-super-secreta-mude-em-producao
SUPER_ADMIN_EMAIL=admin@multitenant.com
SUPER_ADMIN_PASSWORD=admin123456
```

### 4. Setup do Banco de Dados

No projeto raiz, execute os scripts SQL:

```bash
# 1. Criar schema
psql -U user -d database -f scripts/01-create-multitenant-schema.sql

# 2. Setup super admin
psql -U user -d database -f scripts/02-setup-super-admin.sql
```

Ou com Neon:

```bash
# Via web console do Neon ou psql remoto
psql "postgresql://user:password@host/database?sslmode=require" -f scripts/01-create-multitenant-schema.sql
```

### 5. Instalação de Dependências

```bash
npm install
# ou
pnpm install
```

### 6. Setup do Super Admin (Bcrypt)

```bash
npm run setup
# ou
pnpm setup
```

Isso vai:
- Gerar hash seguro da senha do super admin
- Criar primeiro tenant de exemplo
- Adicionar usuário owner no tenant

### 7. Iniciar Desenvolvimento

```bash
npm run dev
# ou
pnpm dev
```

Acesse: http://localhost:3001

### Credenciais Padrão

- **Super Admin Email:** admin@multitenant.com
- **Super Admin Password:** admin123456

- **Tenant Email:** admin@empresa1.com
- **Tenant Password:** tenant123456

⚠️ **IMPORTANTE:** Mude as senhas em produção!

## API Endpoints

### Autenticação

```
POST /api/auth/login
POST /api/auth/logout
```

### Tenants (Admin)

```
GET    /api/admin/tenants              - Listar tenants
POST   /api/admin/tenants              - Criar tenant
GET    /api/admin/tenants/:id          - Obter tenant
PATCH  /api/admin/tenants/:id          - Atualizar tenant
DELETE /api/admin/tenants/:id          - Deletar tenant
```

### Usuários (Admin)

```
GET    /api/admin/users                - Listar usuários
POST   /api/admin/users                - Criar usuário
GET    /api/admin/users/:id            - Obter usuário
PATCH  /api/admin/users/:id            - Atualizar usuário
DELETE /api/admin/users/:id            - Deletar usuário
```

### Auditoria (Admin)

```
GET    /api/admin/audit-logs           - Listar logs
```

### Faturamento (Admin)

```
GET    /api/admin/billing/plans        - Listar planos
GET    /api/admin/billing/subscriptions - Listar assinaturas
```

## Estrutura de Arquivos

```
packages/multitenant-admin/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   └── admin/
│   │       ├── tenants/route.ts
│   │       ├── users/route.ts
│   │       ├── audit-logs/route.ts
│   │       └── billing/route.ts
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── tenants/page.tsx
│   │   ├── users/page.tsx
│   │   ├── billing/page.tsx
│   │   └── audit-logs/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (Login)
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── ...
├── lib/
│   ├── db.ts          (Database connection)
│   ├── auth.ts        (Auth functions)
│   └── ...
├── scripts/
│   └── setup-super-admin.ts
├── middleware.ts      (Proteção de rotas)
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Deploy para Produção

### Vercel

1. Push para GitHub
2. Conecte ao Vercel
3. Configure variáveis de ambiente:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_API_URL`

4. Deploy automático

### Variáveis de Ambiente Obrigatórias

```env
DATABASE_URL=postgresql://...
JWT_SECRET=chave-super-segura-com-muitos-caracteres
NODE_ENV=production
```

## Segurança

✅ **Implementado:**
- Senhas com bcrypt (10 rounds)
- JWT com expiração
- Cookies HTTP-only
- CORS configurado
- Validação com Zod
- Middleware de autenticação
- Auditoria completa
- SQL com prepared statements

🔒 **Recomendações:**
- Use HTTPS em produção
- Mude JWT_SECRET em produção
- Implemente 2FA para super admin
- Rotações de senha regulares
- Backup diário do banco
- Monitoramento de logs

## Próximos Passos

### Phase 1 ✅
- [x] Schema do banco de dados
- [x] Autenticação básica
- [x] API de tenants
- [x] Dashboard básico

### Phase 2 (Próximo)
- [ ] Gerenciamento completo de usuários
- [ ] Sistema de permissões avançado
- [ ] Dashboard com charts
- [ ] Gerenciamento de faturamento
- [ ] Integração com Stripe

### Phase 3
- [ ] Sistema de templates
- [ ] White-label customization
- [ ] API para tenants
- [ ] Webhooks
- [ ] Notificações por email

### Phase 4
- [ ] Mobile app
- [ ] SSO integration
- [ ] Advanced analytics
- [ ] Machine learning insights

## Troubleshooting

### Erro: "DATABASE_URL not set"
```
Verifique se o arquivo .env.local existe e contém DATABASE_URL
```

### Erro: "Unauthorized"
```
Verifique se o token JWT é válido e não expirou
Limpe os cookies do navegador
```

### Erro: "Slug ou subdomain já em uso"
```
Use valores únicos para slug e subdomain
```

## Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Commit suas mudanças: `git commit -am 'Add feature'`
3. Push: `git push origin feature/sua-feature`
4. Crie um Pull Request

## Licença

MIT

## Suporte

Para problemas ou dúvidas:
- Abra uma issue no GitHub
- Envie um email para support@multitenant.com
- Visite a documentação em docs.multitenant.com

---

**Desenvolvido com ❤️ para multi-tenant SaaS**
