import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { stores, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createStoreSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { jwtVerifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const payload = await jwtVerifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;
    const role = payload.role as string;

    let storeList;

    if (role === 'admin') {
      // Admin vê todas as lojas
      storeList = await dbClient.query.stores.findMany();
    } else if (role === 'vendor') {
      // Vendor vê apenas suas lojas
      storeList = await dbClient.query.stores.findMany({
        where: eq(stores.ownerId, userId),
      });
    } else {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    return NextResponse.json(storeList);
  } catch (error) {
    console.error('[v0] Erro ao listar lojas:', error);
    return NextResponse.json(
      { error: 'Erro ao listar lojas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const payload = await jwtVerifyToken(token);
    if (!payload || payload.role !== 'vendor') {
      return NextResponse.json(
        { error: 'Apenas vendedores podem criar lojas' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validar dados
    const validation = createStoreSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const { name, slug: customSlug, description } = validation.data;
    const slug = customSlug || slugify(name);

    // Verificar se slug já existe
    const existingStore = await dbClient.query.stores.findFirst({
      where: eq(stores.slug, slug),
    });

    if (existingStore) {
      return NextResponse.json(
        { error: 'Este slug já está em uso' },
        { status: 409 }
      );
    }

    // Criar loja
    const newStore = await dbClient
      .insert(stores)
      .values({
        name,
        slug,
        description,
        ownerId: payload.userId as string,
      })
      .returning();

    return NextResponse.json(newStore[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Erro ao criar loja:', error);
    return NextResponse.json(
      { error: 'Erro ao criar loja' },
      { status: 500 }
    );
  }
}
