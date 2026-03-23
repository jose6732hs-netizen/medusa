'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  price: string;
  stock: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
}

interface Store {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const params = useParams();
  const storeId = params.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [storeId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Buscar loja
      const storeResponse = await fetch(`/api/stores/${storeId}`);
      if (!storeResponse.ok) {
        throw new Error('Loja não encontrada');
      }
      const storeData = await storeResponse.json();
      setStore(storeData);

      // Buscar produtos
      const productsResponse = await fetch(
        `/api/products?storeId=${storeId}`
      );
      if (!productsResponse.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar dados'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700';
      case 'archived':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {store?.name || 'Produtos'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os produtos da sua loja
            </p>
          </div>
          <Link href={`/dashboard/stores/${storeId}/products/new`}>
            <Button>Novo Produto</Button>
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
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">
                Nenhum produto criado ainda
              </p>
              <Link href={`/dashboard/stores/${storeId}/products/new`}>
                <Button>Criar Primeiro Produto</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Produto
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Preço
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Estoque
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">
                        {formatCurrency(product.price)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{product.stock}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {getStatusLabel(product.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/stores/${storeId}/products/${product.id}`}
                      >
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
