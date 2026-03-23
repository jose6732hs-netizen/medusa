'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Pedido Confirmado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Obrigado pela sua compra! Você receberá um email com os detalhes do seu pedido.
          </p>

          {orderId && (
            <div className="rounded-md bg-secondary p-3">
              <p className="text-xs text-muted-foreground">ID do Pedido</p>
              <p className="font-mono text-sm font-medium text-primary">
                {orderId}
              </p>
            </div>
          )}

          <div className="space-y-2 pt-4">
            <p className="text-sm text-muted-foreground">
              Você pode acompanhar seu pedido pela página de pedidos.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Meus Pedidos
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full">Voltar à Loja</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
