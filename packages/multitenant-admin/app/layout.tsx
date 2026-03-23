import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MultiTenant Admin Panel',
  description: 'Painel de controle para gerenciar tenants, usuários e faturamento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
