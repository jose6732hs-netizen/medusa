import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { orders, orderItems, carts, cartItems, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { jwtVerifyToken } from '@/lib/jwt';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      storeId,
      cartId,
      sessionId,
      customerEmail,
      customerName,
      shippingAddress,
      billingAddress,
    } = body;

    if (!storeId || !customerEmail || !customerName || !shippingAddress) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Buscar carrinho
    const cart = await dbClient.query.carts.findFirst({
      where: and(
        eq(carts.id, cartId || ''),
        eq(carts.storeId, storeId)
      ),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho vazio ou não encontrado' },
        { status: 400 }
      );
    }

    // Calcular total
    let total = 0;
    for (const item of cart.items) {
      total += parseFloat(item.price) * item.quantity;
    }

    // Verificar estoque
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Estoque insuficiente para ${item.product.name}` },
          { status: 409 }
        );
      }
    }

    // Obter customer ID se logado
    const token = request.cookies.get('auth_token')?.value;
    let customerId = null;
    if (token) {
      const payload = await jwtVerifyToken(token);
      if (payload) {
        customerId = payload.userId as string;
      }
    }

    // Criar pedido
    const orderNumber = generateOrderNumber();
    const newOrder = await dbClient
      .insert(orders)
      .values({
        storeId,
        customerId: customerId || undefined,
        orderNumber,
        total: total.toString(),
        customerEmail,
        customerName,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        status: 'pending',
        paymentStatus: 'pending',
      })
      .returning();

    const order = newOrder[0];

    // Criar order items
    for (const item of cart.items) {
      await dbClient.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });

      // Atualizar estoque
      const updatedProduct = await dbClient.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (updatedProduct) {
        await dbClient
          .update(products)
          .set({
            stock: updatedProduct.stock - item.quantity,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));
      }
    }

    // Limpar carrinho
    await dbClient.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    await dbClient.delete(carts).where(eq(carts.id, cart.id));

    return NextResponse.json(
      {
        message: 'Pedido criado com sucesso',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Erro ao criar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    );
  }
}
