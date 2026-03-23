import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { Pool } from 'postgres'

dotenv.config({ path: '.env.local' })

async function setupSuperAdmin() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@multitenant.com'
  const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123456'

  // Gerar hash da senha
  const hashedPassword = await bcrypt.hash(password, 10)

  const pool = new Pool({
    connectionString: databaseUrl,
  })

  try {
    console.log('Setting up super admin...')

    // Inserir ou atualizar super admin
    await pool.query(
      `
      INSERT INTO super_admins (email, password_hash, first_name, last_name, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        status = 'active'
      `,
      [email, hashedPassword, 'Super', 'Admin', 'active']
    )

    console.log('✓ Super admin created/updated')
    console.log(`  Email: ${email}`)
    console.log(`  Password: ${password}`)

    // Criar primeiro tenant de exemplo
    const tenantResult = await pool.query(
      `
      INSERT INTO tenants (slug, name, description, subdomain, status, plan, billing_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
      `,
      [
        'empresa1',
        'Empresa 1',
        'Seu primeiro tenant de teste',
        'empresa1',
        'active',
        'pro',
        'admin@empresa1.com',
      ]
    )

    if (tenantResult.rows.length > 0) {
      const tenantId = tenantResult.rows[0].id

      // Adicionar você como proprietário do tenant
      const ownerPassword = await bcrypt.hash('tenant123456', 10)

      await pool.query(
        `
        INSERT INTO tenant_users (tenant_id, email, password_hash, first_name, last_name, role, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (tenant_id, email) DO UPDATE SET
          role = 'owner',
          status = 'active'
        `,
        [
          tenantId,
          'admin@empresa1.com',
          ownerPassword,
          'Admin',
          'Empresa1',
          'owner',
          'active',
        ]
      )

      console.log('✓ Example tenant created')
      console.log(`  Subdomain: empresa1`)
      console.log(`  Email: admin@empresa1.com`)
      console.log(`  Password: tenant123456`)
    }

    console.log('\n✓ Setup completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Copy .env.example to .env.local')
    console.log('2. Update DATABASE_URL with your Neon connection')
    console.log('3. Run: npm run dev')
    console.log('4. Navigate to http://localhost:3001')
  } catch (error) {
    console.error('Setup error:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setupSuperAdmin()
