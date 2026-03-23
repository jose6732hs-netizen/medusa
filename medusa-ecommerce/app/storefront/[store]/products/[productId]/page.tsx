'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const storeSlug = params.store as string;
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: product.id, // Isso será ajustado
          productId: product.id,
          quantity: parseInt(quantity.toString()),
          sessionId: localStorage.getItem('sessionId') || '',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao adicionar ao carrinho');
      }

      setSuccess('Produto adicionado ao carrinho!');
      setQuantity(1);

      setTimeout(() => {
        window.location.href = `/storefront/${storeSlug}/cart`;
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="rounded-md bg-red-50 p-4 text-red-600">
            {error || 'Produto não encontrado'}
          </div>
          <Link href={`/storefront/${storeSlug}`}>
            <Button className="mt-4">Voltar à Loja</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <Link href={`/storefront/${storeSlug}`}>
            <Button variant="outline">Voltar à Loja</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.description && (
              <div>
                <Label className="text-base">Descrição</Label>
                <p className="mt-2 text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <Label className="text-sm text-muted-foreground">Preço</Label>
                <p className="text-3xl font-bold text-accent">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Disponibilidade
                </Label>
                <p
                  className={`text-sm font-medium ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} em estoque`
                    : 'Fora de estoque'}
                </p>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-3 border-t border-border pt-4">
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                    {success}
                  </div>
                )}

                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  disabled={isAdding || quantity < 1 || quantity > product.stock}
                >
                  {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
