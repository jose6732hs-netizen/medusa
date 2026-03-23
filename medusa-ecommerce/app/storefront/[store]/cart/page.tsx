'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface CartItem {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function CartPage() {
  const params = useParams();
  const storeSlug = params.store as string;

  const [cart, setCart] = useState<Cart | null>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId') || '';
      const response = await fetch(
        `/api/cart?storeId=${storeSlug}&sessionId=${sessionId}`
      );
      if (!response.ok) {
        throw new Error('Erro ao carregar carrinho');
      }
      const data = await response.json();
      setCart(data.cart);
      setTotal(parseFloat(data.total));
      localStorage.setItem('sessionId', data.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar carrinho');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar quantidade');
      }

      await fetchCart();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao atualizar quantidade'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover item');
      }

      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover item');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Seu Carrinho</h1>
          <Link href={`/storefront/${storeSlug}`}>
            <Button variant="outline">Continuar Comprando</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">
                Seu carrinho está vazio
              </p>
              <Link href={`/storefront/${storeSlug}`}>
                <Button>Voltar à Loja</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                          disabled={isUpdating}
                          className="w-16 rounded-md border border-border bg-background px-2 py-1 text-center text-sm"
                        />
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                          className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          Remover
                        </button>
                      </div>

                      <div className="ml-4 text-right">
                        <p className="font-semibold text-primary">
                          {formatCurrency(
                            (parseFloat(item.price) * item.quantity).toString()
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(total.toString())}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">Grátis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-accent">
                      {formatCurrency(total.toString())}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/storefront/${storeSlug}/checkout`} className="w-full">
                    <Button className="w-full">Ir para Checkout</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
