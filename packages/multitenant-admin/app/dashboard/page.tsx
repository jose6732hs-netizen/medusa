'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { DashboardLayout } from '@/components/Sidebar'
import { verifyToken, getTokenFromCookie } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticação do lado do cliente
    const token = getTokenFromCookie(document.cookie)

    if (!token) {
      router.push('/')
      return
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      router.push('/')
      return
    }

    setUser(decoded)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header userName={user.first_name || user.email} userEmail={user.email} />
      <DashboardLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo de volta, {user.first_name}!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body">
                <p className="text-gray-600 text-sm font-medium">Total de Tenants</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <p className="text-gray-600 text-sm font-medium">Usuários Ativos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <p className="text-gray-600 text-sm font-medium">Receita Mensal</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">R$ -</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <p className="text-gray-600 text-sm font-medium">Taxa de Crescimento</p>
                <p className="text-3xl font-bold text-success mt-2">-%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <div className="card-header">
                <h2 className="text-xl font-bold">Atividades Recentes</h2>
              </div>
              <div className="card-body">
                <p className="text-gray-600">Nenhuma atividade registrada</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-bold">Informações do Sistema</h2>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Versão</p>
                  <p className="font-medium">1.0.0</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-green-600">Online</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última Sincronização</p>
                  <p className="font-medium text-sm">Agora</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
