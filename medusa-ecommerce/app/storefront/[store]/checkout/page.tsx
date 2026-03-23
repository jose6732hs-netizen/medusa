'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.store as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    billingAddress: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Aqui você buscaria o cartId e storeId reais
      // Por enquanto usando valores simulados
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: storeSlug,
          cartId: localStorage.getItem('cartId') || '',
          sessionId: localStorage.getItem('sessionId') || '',
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao processar pedido');
      }

      const data = await response.json();

      // Limpar carrinho do localStorage
      localStorage.removeItem('cartId');
      localStorage.removeItem('sessionId');

      // Redirecionar para página de sucesso
      router.push(
        `/storefront/${storeSlug}/order-confirmation?orderId=${data.order.id}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Checkout</h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Entrega</CardTitle>
            <CardDescription>
              Preencha seus dados para completar o pedido
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
                <Label htmlFor="customerName">Nome Completo *</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="João Silva"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  placeholder="joao@example.com"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Endereço de Entrega *</Label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  placeholder="Rua, Número, Bairro, Cidade, Estado, CEP"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">Endereço de Cobrança</Label>
                <textarea
                  id="billingAddress"
                  name="billingAddress"
                  placeholder="Deixe em branco para usar o mesmo endereço de entrega"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Confirmar Pedido'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 rounded-md bg-blue-50 p-4">
          <p className="text-sm text-blue-600">
            Nota: O processamento de pagamento via Stripe será implementado na próxima fase.
          </p>
        </div>
      </main>
    </div>
  );
}
