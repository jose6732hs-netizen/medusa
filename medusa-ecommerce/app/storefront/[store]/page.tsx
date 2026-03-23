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
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  image?: string;
}

interface Store {
  id: string;
  name: string;
  description?: string;
}

export default function StorefrontPage() {
  const params = useParams();
  const storeSlug = params.store as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStoreData();
  }, [storeSlug]);

  const fetchStoreData = async () => {
    try {
      setIsLoading(true);

      // Em uma app real, você buscaria pelo slug. Por enquanto usamos como ID
      const storeResponse = await fetch(`/api/stores/${storeSlug}`);
      if (!storeResponse.ok) {
        throw new Error('Loja não encontrada');
      }
      const storeData = await storeResponse.json();
      setStore(storeData);

      // Buscar produtos da loja
      const productsResponse = await fetch(
        `/api/products?storeId=${storeData.id}`
      );
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(
          productsData.filter((p: Product & { status: string }) => p.status === 'active')
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar loja'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </header>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <p className="text-red-600">{error || 'Loja não encontrada'}</p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{store.name}</h1>
            {store.description && (
              <p className="text-sm text-muted-foreground">
                {store.description}
              </p>
            )}
          </div>
          <Link href={`/storefront/${storeSlug}/cart`}>
            <Button>Ir para Carrinho</Button>
          </Link>
        </div>
      </header>

      {/* Products Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum produto disponível no momento
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.description && (
                    <p className="text-xs text-muted-foreground">
                      {product.description.substring(0, 100)}...
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-accent">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
                    </p>
                  </div>
                  <Link href={`/storefront/${storeSlug}/products/${product.id}`}>
                    <Button
                      className="w-full"
                      disabled={product.stock === 0}
                    >
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
