import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { carts, cartItems, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { jwtVerifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { error: 'storeId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar ou criar carrinho
    const token = request.cookies.get('auth_token')?.value;
    let customerId = null;
    let sessionId = searchParams.get('sessionId');

    if (token) {
      const payload = await jwtVerifyToken(token);
      if (payload) {
        customerId = payload.userId as string;
      }
    }

    if (!sessionId && !customerId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    let cart = await dbClient.query.carts.findFirst({
      where: and(
        eq(carts.storeId, storeId),
        customerId ? eq(carts.customerId, customerId) : eq(carts.sessionId, sessionId || '')
      ),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      const newCart = await dbClient
        .insert(carts)
        .values({
          storeId,
          customerId,
          sessionId: !customerId ? sessionId : null,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        })
        .returning();

      cart = { ...newCart[0], items: [] };
    }

    // Calcular totais
    const total = cart.items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    return NextResponse.json({
      cart,
      total: total.toFixed(2),
      sessionId: sessionId || cart.sessionId,
    });
  } catch (error) {
    console.error('[v0] Erro ao buscar carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar carrinho' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, productId, quantity, sessionId } = body;

    if (!storeId || !productId || !quantity) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const token = request.cookies.get('auth_token')?.value;
    let customerId = null;

    if (token) {
      const payload = await jwtVerifyToken(token);
      if (payload) {
        customerId = payload.userId as string;
      }
    }

    // Buscar produto
    const product = await dbClient.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product || product.storeId !== storeId) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Estoque insuficiente' },
        { status: 409 }
      );
    }

    // Buscar ou criar carrinho
    let cart = await dbClient.query.carts.findFirst({
      where: and(
        eq(carts.storeId, storeId),
        customerId ? eq(carts.customerId, customerId) : eq(carts.sessionId, sessionId || '')
      ),
    });

    if (!cart) {
      const newCart = await dbClient
        .insert(carts)
        .values({
          storeId,
          customerId,
          sessionId: !customerId ? sessionId : null,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .returning();
      cart = newCart[0];
    }

    // Adicionar item ao carrinho
    const newItem = await dbClient
      .insert(cartItems)
      .values({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      })
      .returning();

    return NextResponse.json(newItem[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Erro ao adicionar ao carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar ao carrinho' },
      { status: 500 }
    );
  }
}
