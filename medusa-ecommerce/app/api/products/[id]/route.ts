import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerifyToken } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await dbClient.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        variants: true,
        categories: {
          with: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[v0] Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
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

    // Verificar se produto existe
    const product = await dbClient.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Verificar permissões
    const store = await dbClient.query.stores.findFirst({
      where: eq(dbClient.query.stores.$db.stores.id, product.storeId),
    });

    if (payload.role !== 'admin' && store?.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, sku, price, cost, stock, status } = body;

    // Atualizar produto
    const updatedProduct = await dbClient
      .update(products)
      .set({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(sku && { sku }),
        ...(price && { price }),
        ...(cost && { cost }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(status && { status }),
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('[v0] Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Verificar se produto existe
    const product = await dbClient.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Verificar permissões
    const store = await dbClient.query.stores.findFirst({
      where: eq(dbClient.query.stores.$db.stores.id, product.storeId),
    });

    if (payload.role !== 'admin' && store?.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Deletar produto
    await dbClient.delete(products).where(eq(products.id, id));

    return NextResponse.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('[v0] Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    );
  }
}
