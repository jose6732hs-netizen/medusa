import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerifyToken } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await dbClient.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: {
              columns: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        customer: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('[v0] Erro ao buscar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Verificar se pedido existe
    const order = await dbClient.query.orders.findFirst({
      where: eq(orders.id, id),
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Verificar permissões
    const store = await dbClient.query.stores.findFirst({
      where: eq(dbClient.query.stores.$db.stores.id, order.storeId),
    });

    if (payload.role !== 'admin' && store?.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus } = body;

    // Atualizar pedido
    const updatedOrder = await dbClient
      .update(orders)
      .set({
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json(updatedOrder[0]);
  } catch (error) {
    console.error('[v0] Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    );
  }
}
