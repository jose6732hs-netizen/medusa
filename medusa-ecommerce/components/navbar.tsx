'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface NavBarProps {
  isLoggedIn?: boolean
  userRole?: 'admin' | 'vendor' | 'customer'
  userName?: string
}

export function NavBar({ isLoggedIn, userRole, userName }: NavBarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          Medusa Ecommerce
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {userRole === 'vendor' && (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              {userRole === 'admin' && (
                <Link href="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              )}
              <span className="text-sm text-gray-600">{userName}</span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button>Registrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
