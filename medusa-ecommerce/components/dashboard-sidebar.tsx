'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  storeId?: string
  currentPage?: string
}

export function DashboardSidebar({ storeId, currentPage }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Lojas', href: '/dashboard/stores', icon: '🏪' },
    ...(storeId ? [
      { label: 'Produtos', href: `/dashboard/stores/${storeId}/products`, icon: '📦' },
      { label: 'Pedidos', href: `/dashboard/stores/${storeId}/orders`, icon: '📋' },
      { label: 'Analytics', href: `/dashboard/stores/${storeId}/analytics`, icon: '📈' },
    ] : []),
  ]

  return (
    <div className={`h-screen bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {isOpen && <h2 className="font-bold text-lg">Menu</h2>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition-colors ${
              currentPage === item.href ? 'bg-gray-800 border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}
