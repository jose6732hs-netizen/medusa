-- Criar tabela de sessões de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL DEFAULT 'anonymous',
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, user_id)
);

-- Criar tabela de mensagens de chat
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  tenant_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  user_message TEXT NOT NULL,
  ai_message TEXT,
  model VARCHAR(50) DEFAULT 'gpt-4-turbo',
  tokens_used INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX idx_chat_sessions_tenant ON chat_sessions(tenant_id);
CREATE INDEX idx_chat_sessions_user ON chat_sessions(tenant_id, user_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_tenant ON chat_messages(tenant_id);
CREATE INDEX idx_chat_messages_user ON chat_messages(tenant_id, user_id);
