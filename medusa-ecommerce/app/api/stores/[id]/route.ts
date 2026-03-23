import { NextRequest, NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerifyToken } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const store = await dbClient.query.stores.findFirst({
      where: eq(stores.id, id),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error('[v0] Erro ao buscar loja:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar loja' },
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

    // Verificar se a loja existe
    const store = await dbClient.query.stores.findFirst({
      where: eq(stores.id, id),
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      );
    }

    // Verificar permissões
    if (payload.role !== 'admin' && store.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para atualizar esta loja' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, isActive } = body;

    // Atualizar loja
    const updatedStore = await dbClient
      .update(stores)
      .set({
        ...(name && { name }),
        ...(description && { description }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(stores.id, id))
      .returning();

    return NextResponse.json(updatedStore[0]);
  } catch (error) {
    console.error('[v0] Erro ao atualizar loja:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar loja' },
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

    // Verificar se a loja existe
    const store = await dbClient.query.stores.findFirst({
      where: eq(stores.id, id),
    });

    if (!store) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      );
    }

    // Verificar permissões
    if (payload.role !== 'admin' && store.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar esta loja' },
        { status: 403 }
      );
    }

    // Deletar loja
    await dbClient.delete(stores).where(eq(stores.id, id));

    return NextResponse.json({ message: 'Loja deletada com sucesso' });
  } catch (error) {
    console.error('[v0] Erro ao deletar loja:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar loja' },
      { status: 500 }
    );
  }
}
