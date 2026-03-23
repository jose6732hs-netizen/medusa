import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Painel de Controle</h1>
          <Button variant="outline">Sair</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total de Vendas', value: 'R$ 0,00' },
            { label: 'Pedidos', value: '0' },
            { label: 'Produtos', value: '0' },
            { label: 'Clientes', value: '0' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
                <div className="mt-2 text-2xl font-bold text-primary">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Minhas Lojas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Gerencie suas lojas e configurações
              </p>
              <Link href="/dashboard/stores">
                <Button className="w-full">Ir para Lojas</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Criar e gerenciar seus produtos
              </p>
              <Link href="/dashboard/products">
                <Button className="w-full">Ir para Produtos</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Visualizar e gerenciar pedidos
              </p>
              <Link href="/dashboard/orders">
                <Button className="w-full">Ir para Pedidos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
