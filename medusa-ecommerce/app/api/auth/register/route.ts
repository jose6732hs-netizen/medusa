import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbClient } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { registerSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const { email, name, password, role } = validation.data;

    // Verificar se usuário já existe
    const existingUser = await dbClient.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está registrado' },
        { status: 409 }
      );
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar usuário
    const newUser = await dbClient
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
        role: role as 'admin' | 'vendor' | 'customer',
      })
      .returning({ id: users.id, email: users.email });

    return NextResponse.json(
      { message: 'Conta criada com sucesso', user: newUser[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Erro ao registrar:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}
