'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      })

      if (response.status === 200) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Erro ao fazer login. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            MultiTenant Admin
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Painel de Controle Super Admin
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="admin@multitenant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Sua senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-700">
              <strong>Credenciais de Teste:</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Email: admin@multitenant.com
            </p>
            <p className="text-sm text-gray-600">
              Senha: (verifique variáveis de ambiente)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
