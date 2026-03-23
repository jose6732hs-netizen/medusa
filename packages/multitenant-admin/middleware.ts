import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getTokenFromCookie } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/api/auth/login', '/api/auth/logout']

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificar se é rota protegida
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/admin')) {
    // Obter token do cookie
    const token = getTokenFromCookie(request.headers.get('cookie') || '')

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Verificar validade do token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Adicionar usuário ao contexto da requisição
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.id)
    requestHeaders.set('x-user-email', decoded.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
}
