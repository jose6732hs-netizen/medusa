import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
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

    // Verificar acesso à loja
    const store = await dbClient.query.stores.findFirst({
      where: eq(dbClient.query.stores.$db.stores.id, storeId),
    });

    if (payload.role !== 'admin' && store?.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const orderList = await dbClient.query.orders.findMany({
      where: eq(orders.storeId, storeId),
      with: {
        items: true,
        customer: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    return NextResponse.json(orderList);
  } catch (error) {
    console.error('[v0] Erro ao listar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar pedidos' },
      { status: 500 }
    );
  }
}
