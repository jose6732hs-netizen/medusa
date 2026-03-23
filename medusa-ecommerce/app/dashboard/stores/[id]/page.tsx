'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;

  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    fetchStore();
  }, [storeId]);

  const fetchStore = async () => {
    try {
      const response = await fetch(`/api/stores/${storeId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar loja');
      }
      const data = await response.json();
      setStore(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        isActive: data.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar loja');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar loja');
      }

      router.push('/dashboard/stores?success=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar loja');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta loja? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar loja');
      }

      router.push('/dashboard/stores?deleted=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar loja');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">Carregando...</h1>
          </div>
        </header>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">Loja não encontrada</h1>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Editar Loja</h1>
          <Link href="/dashboard/stores">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Loja</CardTitle>
            <CardDescription>
              Atualize os dados da sua loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="isActive" className="mb-0">
                  Loja ativa
                </Label>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Mudanças'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-700"
              disabled={isSaving}
            >
              Deletar esta loja
            </button>
          </CardFooter>
        </Card>

        {/* Slug Info Card */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Informações da URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground">Slug</p>
              <p className="font-mono text-sm text-primary">{store.slug}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                URL da sua loja: storefront.com/{store.slug}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Links Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link
              href={`/dashboard/stores/${storeId}/products`}
              className="text-accent hover:underline"
            >
              Gerenciar Produtos
            </Link>
            <Link
              href={`/dashboard/stores/${storeId}/orders`}
              className="text-accent hover:underline"
            >
              Ver Pedidos
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
