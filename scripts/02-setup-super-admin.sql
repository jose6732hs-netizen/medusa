-- =====================================================
-- SETUP SUPER ADMIN INICIAL
-- =====================================================

-- Inserir super admin (você como dono)
-- NOTA: A senha aqui é apenas um hash de exemplo
-- Em produção, substitua pelo hash real gerado com bcrypt

INSERT INTO super_admins (
  email,
  password_hash,
  first_name,
  last_name,
  status
) VALUES (
  'admin@multitenant.com',
  '$2b$10$YourBcryptHashHereReplace', -- Será atualizado com bcrypt real
  'Super',
  'Admin',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Inserir primeiro tenant de exemplo
INSERT INTO tenants (
  slug,
  name,
  description,
  subdomain,
  status,
  plan,
  billing_email
) VALUES (
  'empresa1',
  'Empresa 1',
  'Seu primeiro tenant',
  'empresa1',
  'active',
  'pro',
  'admin@empresa1.com'
) ON CONFLICT (slug) DO NOTHING;

-- Adicionar você como proprietário do primeiro tenant
INSERT INTO tenant_users (
  tenant_id,
  email,
  password_hash,
  first_name,
  last_name,
  role,
  status
)
SELECT
  t.id,
  'admin@empresa1.com',
  '$2b$10$YourBcryptHashHereReplace',
  'Admin',
  'Empresa1',
  'owner',
  'active'
FROM tenants t
WHERE t.slug = 'empresa1'
ON CONFLICT (tenant_id, email) DO NOTHING;
