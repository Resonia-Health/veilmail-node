import type { NextAuthConfig } from 'next-auth'

export default {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAuth = ['/login', '/register', '/verify-email', '/reset-password', '/new-password', '/verify-2fa'].some(
        (path) => nextUrl.pathname.startsWith(path)
      )

      if (isOnDashboard) {
        return isLoggedIn
      }

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
