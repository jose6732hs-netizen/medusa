import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { cartItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerifyToken } from '@/lib/jwt';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantidade deve ser maior que 0' },
        { status: 400 }
      );
    }

    const updatedItem = await dbClient
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, itemId))
      .returning();

    return NextResponse.json(updatedItem[0]);
  } catch (error) {
    console.error('[v0] Erro ao atualizar item do carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    await dbClient.delete(cartItems).where(eq(cartItems.id, itemId));

    return NextResponse.json({ message: 'Item removido do carrinho' });
  } catch (error) {
    console.error('[v0] Erro ao remover item do carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao remover item' },
      { status: 500 }
    );
  }
}
