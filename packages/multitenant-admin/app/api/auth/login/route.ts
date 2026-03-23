import { NextRequest, NextResponse } from 'next/server'
import { authenticateSuperAdmin, createToken, hashPassword } from '@/lib/auth'
import { query } from '@/lib/db'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Autenticar super admin
    const admin = await authenticateSuperAdmin(email, password)

    if (!admin) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Criar token JWT
    const token = createToken(admin)

    // Criar resposta com cookie seguro
    const response = NextResponse.json(
      {
        success: true,
        user: admin,
        token,
      },
      { status: 200 }
    )

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
