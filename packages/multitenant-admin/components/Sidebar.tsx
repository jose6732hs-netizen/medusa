'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface NavItem {
  label: string
  href: string
  icon?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Tenants', href: '/dashboard/tenants' },
  { label: 'Usuários', href: '/dashboard/users' },
  { label: 'Faturamento', href: '/dashboard/billing' },
  { label: 'Logs de Auditoria', href: '/dashboard/audit-logs' },
  { label: 'Análises', href: '/dashboard/analytics' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

interface LayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
