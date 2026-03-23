import { Pool, QueryResult } from 'postgres'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString,
      max: 20,
    })
  }

  return pool
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client = getPool()
  try {
    return await client.query<T>(text, params)
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function getConnection() {
  const client = getPool()
  return client.connect()
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
