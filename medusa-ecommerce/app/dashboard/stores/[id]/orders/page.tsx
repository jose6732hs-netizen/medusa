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
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  orderNumber: string;
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  customerName: string;
  customerEmail: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const params = useParams();
  const storeId = params.id as string;

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?storeId=${storeId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'processing':
        return 'bg-blue-50 text-blue-700';
      case 'shipped':
        return 'bg-purple-50 text-purple-700';
      case 'delivered':
        return 'bg-green-50 text-green-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'paid':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPaymentLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'paid':
        return 'Pago';
      case 'failed':
        return 'Falhou';
      case 'refunded':
        return 'Reembolsado';
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
            <h1 className="text-2xl font-bold text-primary">Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os pedidos da sua loja
            </p>
          </div>
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
            <p className="text-muted-foreground">Carregando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                Nenhum pedido criado ainda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Número
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Pagamento
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                    Data
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/stores/${storeId}/orders/${order.id}`}>
                        <p className="font-mono text-sm font-medium text-accent hover:underline">
                          {order.orderNumber}
                        </p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary">
                        {formatCurrency(order.total)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {getPaymentLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(new Date(order.createdAt))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/stores/${storeId}/orders/${order.id}`}
                      >
                        <Button size="sm" variant="outline">
                          Ver
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
