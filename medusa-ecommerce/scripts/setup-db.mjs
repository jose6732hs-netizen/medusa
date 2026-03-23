import { neon } from '@neondatabase/serverless';
import * as schema from '../db/schema';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL não está definido');
  process.exit(1);
}

const client = neon(DATABASE_URL);
const db = client;

async function migrate() {
  try {
    console.log('🚀 Iniciando migração do banco de dados...');
    
    // Criar extensão UUID se não existir
    await db`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log('✓ Extensão uuid-ossp criada');

    // Criar tabelas
    console.log('📦 Criando tabelas...');
    
    // Users
    await db`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Tabela users criada');

    // Stores
    await db`
      CREATE TABLE IF NOT EXISTS stores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        logo_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Tabela stores criada');

    // Products
    await db`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        cost_price DECIMAL(10, 2),
        stock_quantity INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'draft',
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Tabela products criada');

    // Carts
    await db`
      CREATE TABLE IF NOT EXISTS carts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
        session_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Tabela carts criada');

    // Cart Items
    await db`
      CREATE TABLE IF NOT EXISTS cart_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Tabela cart_items criada');

    // Orders
    await db`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        customer_email VARCHAR(255),
        customer_name VARCHAR(255),
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Tabela orders criada');

    // Order Items
    await db`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Tabela order_items criada');

    // Analytics
    await db`
      CREATE TABLE IF NOT EXISTS analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        total_orders INTEGER DEFAULT 0,
        total_revenue DECIMAL(10, 2) DEFAULT 0,
        total_customers INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(store_id, date)
      )
    `;
    console.log('✓ Tabela analytics criada');

    // Create indexes
    console.log('🔑 Criando índices...');
    await db`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await db`CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug)`;
    await db`CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_analytics_store_id ON analytics(store_id)`;
    console.log('✓ Índices criados');

    console.log('✅ Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    process.exit(1);
  }
}

migrate();
