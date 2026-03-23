import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { orders, products, stores } from '@/db/schema';
import { eq, and, gte } from 'drizzle-orm';
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

    // Calcular métricas
    const allOrders = await dbClient.query.orders.findMany({
      where: eq(orders.storeId, storeId),
      with: {
        items: true,
      },
    });

    const totalRevenue = allOrders.reduce(
      (sum, order) => sum + parseFloat(order.total || '0'),
      0
    );

    const totalOrders = allOrders.length;
    const paidOrders = allOrders.filter(
      (o) => o.paymentStatus === 'paid'
    ).length;
    const pendingOrders = allOrders.filter(
      (o) => o.status === 'pending'
    ).length;

    const totalProducts = await dbClient
      .select()
      .from(products)
      .where(eq(products.storeId, storeId));

    const lowStockProducts = totalProducts.filter((p) => p.stock < 10);

    // Pedidos dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = allOrders.filter(
      (o) => new Date(o.createdAt) >= thirtyDaysAgo
    );

    const revenueLastMonth = recentOrders.reduce(
      (sum, order) => sum + parseFloat(order.total || '0'),
      0
    );

    return NextResponse.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      paidOrders,
      pendingOrders,
      lowStockProducts: lowStockProducts.length,
      revenueLastMonth: revenueLastMonth.toFixed(2),
      ordersLastMonth: recentOrders.length,
      averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0',
    });
  } catch (error) {
    console.error('[v0] Erro ao calcular métricas:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular métricas' },
      { status: 500 }
    );
  }
}
