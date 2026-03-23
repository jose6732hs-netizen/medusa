import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createProductSchema } from '@/lib/validations';
import { jwtVerifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
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

    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { error: 'storeId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se usuário tem permissão para acessar esta loja
    const store = await dbClient.query.stores.findFirst({
      where: eq(dbClient.query.stores.$db.stores.id, storeId),
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      );
    }

    if (payload.role !== 'admin' && store.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const productList = await dbClient.query.products.findMany({
      where: eq(products.storeId, storeId),
      with: {
        variants: true,
        categories: {
          with: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(productList);
  } catch (error) {
    console.error('[v0] Erro ao listar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar produtos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();

    // Validar dados
    const validation = createProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const { name, description, sku, price, cost, stock, status, storeId } =
      validation.data;

    if (!storeId) {
      return NextResponse.json(
        { error: 'storeId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se usuário tem permissão para criar produto nesta loja
    const store = await dbClient.query.stores.findFirst({
      where: eq(dbClient.query.stores.$db.stores.id, storeId),
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      );
    }

    if (payload.role !== 'admin' && store.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Criar produto
    const newProduct = await dbClient
      .insert(products)
      .values({
        storeId,
        name,
        description,
        sku,
        price,
        cost: cost || undefined,
        stock: parseInt(stock),
        status: status as 'draft' | 'active' | 'archived',
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}
