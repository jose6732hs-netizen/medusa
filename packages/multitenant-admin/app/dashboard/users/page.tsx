'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { DashboardLayout } from '@/components/Sidebar'
import axios from 'axios'
import useSWR from 'swr'

interface User {
  id: string
  tenant_id: string
  email: string
  first_name: string
  last_name: string
  role: string
  status: string
  created_at: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function UsersPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/users', fetcher)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'user',
    tenant_id: '',
  })
  const [creating, setCreating] = useState(false)

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      await axios.post('/api/admin/users', formData)
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'user',
        tenant_id: '',
      })
      setShowCreateForm(false)
      mutate()
    } catch (error) {
      console.error('Error creating user:', error)
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
              <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
              <p className="text-gray-600 mt-2">Gerenciar usuários dos tenants</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-primary"
            >
              {showCreateForm ? 'Cancelar' : 'Novo Usuário'}
            </button>
          </div>

          {showCreateForm && (
            <div className="card mb-8">
              <div className="card-header">
                <h2 className="text-xl font-bold">Criar Novo Usuário</h2>
              </div>
              <form onSubmit={handleCreateUser} className="card-body space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Primeiro Nome</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="João"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          first_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Último Nome</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Silva"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          last_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="usuario@empresa.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Tenant</label>
                    <select
                      className="form-input"
                      value={formData.tenant_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tenant_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Selecione um tenant</option>
                      {/* Tenants virão de uma query separada */}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Papel</label>
                    <select
                      className="form-input"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Proprietário</option>
                      <option value="viewer">Visualizador</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary w-full disabled:opacity-50"
                >
                  {creating ? 'Criando...' : 'Criar Usuário'}
                </button>
              </form>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando usuários...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Erro ao carregar usuários
            </div>
          )}

          {data && (
            <div className="card">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Tenant</th>
                      <th>Papel</th>
                      <th>Status</th>
                      <th>Criado em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data?.map((user: User) => (
                      <tr key={user.id}>
                        <td className="font-medium">
                          {user.first_name} {user.last_name}
                        </td>
                        <td>{user.email}</td>
                        <td className="text-sm">{user.tenant_id}</td>
                        <td>
                          <span
                            className={`badge badge-${
                              user.role === 'admin' || user.role === 'owner'
                                ? 'info'
                                : 'warning'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge badge-${
                              user.status === 'active' ? 'success' : 'error'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="text-sm">
                          {new Date(user.created_at).toLocaleDateString(
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
