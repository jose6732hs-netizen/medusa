'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
      if (!response.ok) {
        throw new Error('Erro ao carregar lojas');
      }
      const data = await response.json();
      setStores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar lojas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Minhas Lojas</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie suas lojas e configurações
            </p>
          </div>
          <Link href="/dashboard/stores/new">
            <Button>Criar Nova Loja</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Carregando lojas...</p>
          </div>
        ) : stores.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">
                Você ainda não tem nenhuma loja
              </p>
              <Link href="/dashboard/stores/new">
                <Button>Criar Primeira Loja</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Slug</p>
                    <p className="font-mono text-sm text-primary">
                      {store.slug}
                    </p>
                  </div>
                  {store.description && (
                    <div>
                      <p className="text-xs text-muted-foreground">Descrição</p>
                      <p className="text-sm">{store.description}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/dashboard/stores/${store.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Editar
                      </Button>
                    </Link>
                    <Link href={`/dashboard/stores/${store.id}/products`} className="flex-1">
                      <Button className="w-full">Produtos</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
