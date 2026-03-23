'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { DashboardLayout } from '@/components/Sidebar'
import useSWR from 'swr'
import axios from 'axios'

interface AuditLog {
  id: string
  tenant_id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  old_values: any
  new_values: any
  ip_address: string
  user_agent: string
  created_at: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function AuditLogsPage() {
  const { data, error, isLoading } = useSWR('/api/admin/audit-logs', fetcher)
  const [filterAction, setFilterAction] = useState('')
  const [filterResource, setFilterResource] = useState('')

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']
  const resources = [
    'tenant',
    'user',
    'permission',
    'billing',
    'analytics',
  ]

  const mockLogs: AuditLog[] = [
    {
      id: '1',
      tenant_id: 'tenant-1',
      user_id: 'admin-1',
      action: 'CREATE',
      resource_type: 'tenant',
      resource_id: 'tenant-2',
      old_values: null,
      new_values: { name: 'Empresa 2', subdomain: 'empresa2' },
      ip_address: '192.168.1.1',
      user_agent: 'Chrome/120.0',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      tenant_id: 'tenant-1',
      user_id: 'admin-1',
      action: 'UPDATE',
      resource_type: 'tenant',
      resource_id: 'tenant-1',
      old_values: { plan: 'free' },
      new_values: { plan: 'pro' },
      ip_address: '192.168.1.1',
      user_agent: 'Chrome/120.0',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ]

  return (
    <>
      <Header userName="Admin" userEmail="admin@multitenant.com" />
      <DashboardLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Logs de Auditoria</h1>
            <p className="text-gray-600 mt-2">
              Acompanhe todas as ações e mudanças no sistema
            </p>
          </div>

          <div className="card mb-8">
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">Filtrar por Ação</label>
                  <select
                    className="form-input"
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                  >
                    <option value="">Todas as ações</option>
                    {actions.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Filtrar por Recurso</label>
                  <select
                    className="form-input"
                    value={filterResource}
                    onChange={(e) => setFilterResource(e.target.value)}
                  >
                    <option value="">Todos os recursos</option>
                    {resources.map((resource) => (
                      <option key={resource} value={resource}>
                        {resource}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Data De</label>
                  <input type="date" className="form-input" />
                </div>

                <div>
                  <label className="form-label">Data Até</label>
                  <input type="date" className="form-input" />
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando logs...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Erro ao carregar logs de auditoria
            </div>
          )}

          <div className="card">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Ação</th>
                    <th>Recurso</th>
                    <th>Tenant</th>
                    <th>Usuário</th>
                    <th>IP</th>
                    <th>Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="text-sm">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${
                            log.action === 'CREATE'
                              ? 'success'
                              : log.action === 'DELETE'
                              ? 'error'
                              : 'info'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="text-sm font-medium">{log.resource_type}</td>
                      <td className="text-sm">{log.tenant_id}</td>
                      <td className="text-sm">{log.user_id}</td>
                      <td className="text-sm">{log.ip_address}</td>
                      <td>
                        <button className="text-primary hover:underline text-sm">
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando 1-10 de 1.234 registros
            </p>
            <div className="space-x-2">
              <button className="px-3 py-2 border border-muted rounded hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-3 py-2 bg-primary text-white rounded">1</button>
              <button className="px-3 py-2 border border-muted rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-muted rounded hover:bg-gray-50">
                Próxima
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
