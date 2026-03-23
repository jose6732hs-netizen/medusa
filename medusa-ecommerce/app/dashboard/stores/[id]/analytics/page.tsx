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

interface Analytics {
  totalRevenue: string;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  revenueLastMonth: string;
  ordersLastMonth: number;
  averageOrderValue: string;
}

export default function AnalyticsDashboard() {
  const params = useParams();
  const storeId = params.id as string;

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [storeId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?storeId=${storeId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar analytics');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-background">
        <p className="text-red-600">{error || 'Erro ao carregar dados'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Receita Total</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {formatCurrency(analytics.totalRevenue)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Mês: {formatCurrency(analytics.revenueLastMonth)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total de Pedidos</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {analytics.totalOrders}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Mês: {analytics.ordersLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Ticket Médio</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {formatCurrency(analytics.averageOrderValue)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Taxa de Pagamento</div>
            <div className="mt-2 text-3xl font-bold text-primary">
              {analytics.totalOrders > 0
                ? ((analytics.paidOrders / analytics.totalOrders) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {analytics.paidOrders} de {analytics.totalOrders}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pendentes</span>
              <span className="font-medium text-yellow-600">
                {analytics.pendingOrders}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pagos</span>
              <span className="font-medium text-green-600">
                {analytics.paidOrders}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Produtos com Estoque Baixo
              </span>
              <span className="font-medium text-red-600">
                {analytics.lowStockProducts}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
