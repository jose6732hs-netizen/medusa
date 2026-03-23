'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { DashboardLayout } from '@/components/Sidebar'
import axios from 'axios'
import useSWR from 'swr'

interface Tenant {
  id: string
  slug: string
  name: string
  subdomain: string
  status: string
  plan: string
  created_at: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function TenantsPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/tenants', fetcher)
  const [user, setUser] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    subdomain: '',
    billing_email: '',
    description: '',
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    // Aqui você já está autenticado pelo middleware
    const token = document.cookie
    setUser({ first_name: 'Admin', email: 'admin@multitenant.com' })
  }, [])

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      await axios.post('/api/admin/tenants', formData)
      setFormData({
        slug: '',
        name: '',
        subdomain: '',
        billing_email: '',
        description: '',
      })
      setShowCreateForm(false)
      mutate()
    } catch (error) {
      console.error('Error creating tenant:', error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <Header userName="Admin" userEmail="admin@multitenant.com" />
      <DashboardLayout>
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
              <p className="text-gray-600 mt-2">Gerenciar todos os tenants</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-primary"
            >
              {showCreateForm ? 'Cancelar' : 'Novo Tenant'}
            </button>
          </div>

          {showCreateForm && (
            <div className="card mb-8">
              <div className="card-header">
                <h2 className="text-xl font-bold">Criar Novo Tenant</h2>
              </div>
              <form onSubmit={handleCreateTenant} className="card-body space-y-4">
                <div>
                  <label className="form-label">Nome do Tenant</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ex: Empresa XYZ"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Slug</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ex: empresa-xyz"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Subdomain</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ex: empresa-xyz"
                      value={formData.subdomain}
                      onChange={(e) =>
                        setFormData({ ...formData, subdomain: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email de Faturamento</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="billing@empresa.com"
                    value={formData.billing_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_email: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Descrição</label>
                  <textarea
                    className="form-input"
                    placeholder="Descrição do tenant"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary w-full disabled:opacity-50"
                >
                  {creating ? 'Criando...' : 'Criar Tenant'}
                </button>
              </form>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando tenants...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Erro ao carregar tenants
            </div>
          )}

          {data && (
            <div className="card">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Slug</th>
                      <th>Subdomain</th>
                      <th>Plano</th>
                      <th>Status</th>
                      <th>Criado em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data?.map((tenant: Tenant) => (
                      <tr key={tenant.id}>
                        <td className="font-medium">{tenant.name}</td>
                        <td>{tenant.slug}</td>
                        <td>{tenant.subdomain}</td>
                        <td>
                          <span className={`badge badge-${tenant.plan}`}>
                            {tenant.plan}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge badge-${
                              tenant.status === 'active' ? 'success' : 'error'
                            }`}
                          >
                            {tenant.status}
                          </span>
                        </td>
                        <td>
                          {new Date(tenant.created_at).toLocaleDateString(
                            'pt-BR'
                          )}
                        </td>
                        <td>
                          <button className="text-primary hover:underline text-sm">
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}
