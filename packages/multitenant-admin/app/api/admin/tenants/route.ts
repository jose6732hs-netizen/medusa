import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

const createTenantSchema = z.object({
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(255),
  subdomain: z.string().min(3).max(255),
  billing_email: z.string().email().optional(),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const page = request.nextUrl.searchParams.get('page') || '1'
    const limit = request.nextUrl.searchParams.get('limit') || '10'
    const offset = (parseInt(page) - 1) * parseInt(limit)

    // Obter tenants
    const result = await query(
      `
      SELECT id, slug, name, description, subdomain, status, plan, billing_email, logo_url, created_at
      FROM tenants
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    )

    // Contar total
    const countResult = await query('SELECT COUNT(*) FROM tenants')
    const total = parseInt(countResult.rows[0].count)

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Get tenants error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tenants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validar input
    const validation = createTenantSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { slug, name, subdomain, billing_email, description } = validation.data

    // Verificar se slug ou subdomain já existem
    const existingCheck = await query(
      'SELECT id FROM tenants WHERE slug = $1 OR subdomain = $2',
      [slug, subdomain]
    )

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Slug ou subdomain já em uso' },
        { status: 400 }
      )
    }

    // Criar tenant
    const result = await query(
      `
      INSERT INTO tenants (slug, name, subdomain, billing_email, description, status, plan)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, slug, name, description, subdomain, status, plan, billing_email, created_at
      `,
      [slug, name, subdomain, billing_email || null, description || null, 'active', 'free']
    )

    // Registrar em audit log
    await query(
      `
      INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, new_values)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        result.rows[0].id,
        userId,
        'CREATE',
        'tenant',
        result.rows[0].id,
        JSON.stringify(result.rows[0]),
      ]
    )

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create tenant error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar tenant' },
      { status: 500 }
    )
  }
}
