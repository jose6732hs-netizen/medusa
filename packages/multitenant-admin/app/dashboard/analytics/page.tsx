'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { DashboardLayout } from '@/components/Sidebar'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  return (
    <>
      <Header userName="Admin" userEmail="admin@multitenant.com" />
      <DashboardLayout>
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Análises</h1>
              <p className="text-gray-600 mt-2">Dashboard de métricas do sistema</p>
            </div>
            <select
              className="form-input w-40"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Este ano</option>
              <option value="all">Todos os tempos</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Tenants Ativos
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                  </div>
                  <div className="text-2xl">📊</div>
                </div>
                <p className="text-green-600 text-sm mt-2">
                  ↑ 0% comparado ao período anterior
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Usuários Totais
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                  </div>
                  <div className="text-2xl">👥</div>
                </div>
                <p className="text-green-600 text-sm mt-2">
                  ↑ 0% comparado ao período anterior
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">MRR Total</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      R$ 0
                    </p>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>
                <p className="text-green-600 text-sm mt-2">
                  ↑ 0% comparado ao período anterior
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Taxa de Crescimento
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0%</p>
                  </div>
                  <div className="text-2xl">📈</div>
                </div>
                <p className="text-green-600 text-sm mt-2">
                  Crescimento mês a mês
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <div className="card-header">
                <h2 className="text-xl font-bold">Crescimento de Tenants</h2>
              </div>
              <div className="card-body h-80 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">
                  Gráfico será renderizado aqui (integração com Recharts)
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-bold">Distribuição por Plano</h2>
              </div>
              <div className="card-body h-80 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">
                  Gráfico será renderizado aqui
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-bold">Tenants Mais Ativos</h2>
              </div>
              <div className="card-body">
                <p className="text-gray-600">Nenhum dado disponível</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-bold">Desvio de Valor (Churn)</h2>
              </div>
              <div className="card-body">
                <p className="text-gray-600">Nenhum dado disponível</p>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <div className="card-header">
              <h2 className="text-xl font-bold">Métricas Mensais</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Novos Tenants</th>
                    <th>MRR</th>
                    <th>Crescimento</th>
                    <th>Taxa de Retenção</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Janeiro 2026</td>
                    <td>0</td>
                    <td>R$ 0</td>
                    <td className="text-green-600">0%</td>
                    <td>-%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
