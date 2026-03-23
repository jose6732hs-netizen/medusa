import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="text-2xl font-bold text-primary">Medusa</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Criar Conta</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary">
          Plataforma de ECommerce
          <span className="block text-accent">Multi-Tenant Moderna</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
          Uma solução completa para criar e gerenciar múltiplas lojas online com
          um único painel administrativo.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button size="lg" className="px-8">
              Começar Agora
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="px-8">
              Saiba Mais
            </Button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="border-t border-border bg-background py-20"
      >
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-primary">
            Recursos Principais
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Multi-Tenant',
                description: 'Gerencie múltiplas lojas em uma única plataforma',
              },
              {
                title: 'Gestão de Produtos',
                description: 'CRUD completo com categorias e variantes',
              },
              {
                title: 'Carrinho e Checkout',
                description: 'Checkout seguro integrado com Stripe',
              },
              {
                title: 'Gestão de Pedidos',
                description: 'Rastreie pedidos em tempo real',
              },
              {
                title: 'Painel Admin',
                description: 'Dashboard com métricas e relatórios',
              },
              {
                title: 'Autenticação',
                description: 'Sistema de roles e permissões robusto',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-secondary p-6"
              >
                <h3 className="font-semibold text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-muted-foreground">
          <p>© 2024 Medusa ECommerce. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
