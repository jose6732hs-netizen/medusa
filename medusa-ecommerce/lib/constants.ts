/**
 * Constantes do Projeto
 */

// Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CUSTOMER: 'customer',
} as const

// Labels
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  processing: 'Em Processamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: 'Não Pago',
  paid: 'Pago',
  failed: 'Falha',
  refunded: 'Reembolsado',
}

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  active: 'Ativo',
  archived: 'Arquivado',
}

// Colors
export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800',
}

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800',
}

// Pagination
export const ITEMS_PER_PAGE = 10

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 255,
  MAX_SLUG_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 5000,
}

// Currencies
export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'BRL', label: 'Brazilian Real' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
] as const
