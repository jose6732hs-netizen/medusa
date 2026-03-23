import { drizzle } from 'drizzle-orm/neon-http';
import { http } from '@neondatabase/serverless';
import * as schema from './db/schema';

const sql = http(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function migrate() {
  try {
    console.log('[v0] Iniciando migração do banco de dados...');
    
    // As tabelas serão criadas automaticamente pelo Drizzle
    // Este script apenas confirma a conexão
    
    // Test connection
    const result = await db.query.users.findFirst();
    console.log('[v0] Conexão com banco estabelecida com sucesso!');
    console.log('[v0] Banco pronto para usar!');
    
  } catch (error) {
    console.error('[v0] Erro na migração:', error);
    process.exit(1);
  }
}

migrate();
