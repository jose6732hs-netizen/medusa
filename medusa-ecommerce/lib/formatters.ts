/**
 * Helpers de Formatação e Utilitários
 */

import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants'

// Currency Formatting
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value)
}

// Date Formatting
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// Status Formatting
export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] || status
}

export function getPaymentStatusLabel(status: string): string {
  return PAYMENT_STATUS_LABELS[status] || status
}

// URL Slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Truncate String
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Capitalize
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Email Validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calculate totals
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Discount calculation
export function calculateDiscount(originalPrice: number, discountPercentage: number): number {
  return originalPrice * (discountPercentage / 100)
}

// Price with discount
export function getPriceWithDiscount(originalPrice: number, discountPercentage: number): number {
  return originalPrice - calculateDiscount(originalPrice, discountPercentage)
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// Check if URL is valid
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}
