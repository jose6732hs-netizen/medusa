-- =====================================================
-- MULTITENANT SCHEMA - NEON POSTGRESQL
-- =====================================================

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subdomain VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  billing_email VARCHAR(255),
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table with tenant relationship
CREATE TABLE IF NOT EXISTS tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'user', 'viewer')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at TIMESTAMP WITH TIME ZONE,
  profile_picture_url VARCHAR(500),
  phone VARCHAR(20),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_email_per_tenant UNIQUE(tenant_id, email)
);

-- Create super admin users (global)
CREATE TABLE IF NOT EXISTS super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at TIMESTAMP WITH TIME ZONE,
  profile_picture_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create invites table
CREATE TABLE IF NOT EXISTS tenant_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  invited_by UUID REFERENCES tenant_users(id) ON DELETE SET NULL,
  invite_code VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_pending_invite UNIQUE(tenant_id, email, accepted_at)
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(100),
  action VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions table (junction)
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'user', 'viewer')),
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_role_permission UNIQUE(role, permission_id)
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES tenant_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create billing_plans table
CREATE TABLE IF NOT EXISTS billing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2),
  price_annually DECIMAL(10, 2),
  max_users INTEGER,
  max_products INTEGER,
  max_orders INTEGER,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create billing_subscriptions table
CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES billing_plans(id),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due')),
  billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annually')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS tenant_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX_DATE DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_email ON tenant_users(email);
CREATE INDEX IF NOT EXISTS idx_tenant_users_role ON tenant_users(role);
CREATE INDEX IF NOT EXISTS idx_tenant_users_status ON tenant_users(status);
CREATE INDEX IF NOT EXISTS idx_super_admins_email ON super_admins(email);
CREATE INDEX IF NOT EXISTS idx_tenant_invites_tenant_id ON tenant_invites(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invites_email ON tenant_invites(email);
CREATE INDEX IF NOT EXISTS idx_tenant_invites_code ON tenant_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_tenant_id ON billing_subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status ON billing_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_tenant_analytics_tenant_id ON tenant_analytics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_analytics_recorded_at ON tenant_analytics(recorded_at);

-- =====================================================
-- DEFAULT PERMISSIONS
-- =====================================================

INSERT INTO permissions (name, resource, action, description) VALUES
  ('view_dashboard', 'dashboard', 'read', 'Visualizar dashboard'),
  ('manage_users', 'users', 'write', 'Gerenciar usuários'),
  ('manage_roles', 'roles', 'write', 'Gerenciar papéis'),
  ('view_analytics', 'analytics', 'read', 'Visualizar análises'),
  ('manage_billing', 'billing', 'write', 'Gerenciar faturamento'),
  ('manage_settings', 'settings', 'write', 'Gerenciar configurações'),
  ('view_audit_logs', 'audit_logs', 'read', 'Visualizar logs de auditoria'),
  ('manage_tenants', 'tenants', 'write', 'Gerenciar tenants (super admin)')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
INSERT INTO role_permissions (role, permission_id)
SELECT 'owner', id FROM permissions WHERE name = 'manage_users'
UNION ALL
SELECT 'owner', id FROM permissions WHERE name = 'manage_settings'
UNION ALL
SELECT 'owner', id FROM permissions WHERE name = 'view_analytics'
UNION ALL
SELECT 'admin', id FROM permissions WHERE name = 'manage_users'
UNION ALL
SELECT 'admin', id FROM permissions WHERE name = 'view_analytics'
UNION ALL
SELECT 'user', id FROM permissions WHERE name = 'view_dashboard'
UNION ALL
SELECT 'viewer', id FROM permissions WHERE name = 'view_dashboard'
ON CONFLICT (role, permission_id) DO NOTHING;

-- =====================================================
-- DEFAULT BILLING PLANS
-- =====================================================

INSERT INTO billing_plans (name, slug, description, price_monthly, price_annually, max_users, max_products, max_orders, features) VALUES
  ('Free', 'free', 'Plano gratuito com funcionalidades básicas', 0.00, 0.00, 3, 100, 50, '{"api_access": false, "support": "community"}'),
  ('Starter', 'starter', 'Ideal para pequenos negócios', 29.90, 299.00, 10, 1000, 500, '{"api_access": true, "support": "email", "advanced_analytics": false}'),
  ('Pro', 'pro', 'Para negócios em crescimento', 99.90, 999.00, 50, 10000, 5000, '{"api_access": true, "support": "priority", "advanced_analytics": true}'),
  ('Enterprise', 'enterprise', 'Solução completa customizável', 299.90, 2999.00, NULL, NULL, NULL, '{"api_access": true, "support": "dedicated", "advanced_analytics": true, "custom_features": true}')
ON CONFLICT (slug) DO NOTHING;
