'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { DashboardLayout } from '@/components/Sidebar'
import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function BillingPage() {
  const { data, error, isLoading } = useSWR('/api/admin/billing/plans', fetcher)

  const plans = [
    {
      name: 'Free',
      price: 'R$ 0',
      period: 'mês',
      description: 'Para começar',
      features: [
        'Até 3 usuários',
        'Até 100 produtos',
        'Até 50 pedidos',
        'Suporte por email',
        'Sem API',
      ],
    },
    {
      name: 'Starter',
      price: 'R$ 29,90',
      period: 'mês',
      description: 'Para pequenos negócios',
      features: [
        'Até 10 usuários',
        'Até 1.000 produtos',
        'Até 500 pedidos',
        'Suporte prioritário',
        'API completa',
        'Analytics básico',
      ],
      popular: true,
    },
    {
      name: 'Pro',
      price: 'R$ 99,90',
      period: 'mês',
      description: 'Para crescimento',
      features: [
        'Até 50 usuários',
        'Até 10.000 produtos',
        'Até 5.000 pedidos',
        'Suporte 24/7',
        'API avançada',
        'Analytics completo',
        'Webhooks',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Customizado',
      period: '',
      description: 'Solução completa',
      features: [
        'Usuários ilimitados',
        'Produtos ilimitados',
        'Pedidos ilimitados',
        'Suporte dedicado',
        'Customização completa',
        'SLA garantido',
        'Integração em tempo real',
      ],
    },
  ]

  return (
    <>
      <Header userName="Admin" userEmail="admin@multitenant.com" />
      <DashboardLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Faturamento</h1>
            <p className="text-gray-600 mt-2">Gerenciar planos e assinaturas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <div className="card-body">
                <p className="text-gray-600 text-sm font-medium">MRR Total</p>
                <p className="text-3xl font-bold text-primary mt-2">R$ 0</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <p className="text-gray-600 text-sm font-medium">Assinaturas Ativas</p>
                <p className="text-3xl font-bold text-success mt-2">0</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <p className="text-gray-600 text-sm font-medium">Churn Rate</p>
                <p className="text-3xl font-bold text-warning mt-2">0%</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <p className="text-gray-600 text-sm font-medium">LTV Médio</p>
                <p className="text-3xl font-bold text-info mt-2">R$ 0</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Planos Disponíveis</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`card ${plan.popular ? 'ring-2 ring-primary' : ''}`}
                >
                  {plan.popular && (
                    <div className="bg-primary text-white px-4 py-2 text-sm font-medium text-center">
                      Mais Popular
                    </div>
                  )}
                  <div className="card-body">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{plan.description}</p>

                    <div className="mt-4 mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-600 text-sm">/{plan.period}</span>
                      )}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="text-success mr-2">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                        plan.popular
                          ? 'btn btn-primary'
                          : 'btn btn-secondary bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      Selecionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold">Assinaturas Recentes</h2>
            </div>
            <div className="card-body">
              <p className="text-gray-600">Nenhuma assinatura ainda</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
