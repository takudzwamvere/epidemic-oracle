import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { UserRole } from './roles'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const pathname = request.nextUrl.pathname

  // Allow public routes
  const isPublicRoute = 
    pathname.startsWith('/auth') || 
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')

  if (!user && !isPublicRoute) {
    // No user, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // If user is authenticated, check role-based access
  if (user) {
    // Get user role from database
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.sub)
      .single()

    const userRole = profile?.role as UserRole | null

    if (userRole) {
      // Define protected route patterns
      const isSuperAdminRoute = pathname.startsWith('/superadmin')
      const isHealthAdminRoute = pathname.startsWith('/health-admin')
      const isDefaultUserRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/protected')

      // Role-based access control
      if (isSuperAdminRoute && userRole !== 'superadmin') {
        // Only superadmins can access superadmin routes
        const url = request.nextUrl.clone()
        url.pathname = getDefaultRedirectPath(userRole)
        return NextResponse.redirect(url)
      }

      if (isHealthAdminRoute && userRole !== 'health_admin' && userRole !== 'superadmin') {
        // Only health admins and superadmins can access health admin routes
        const url = request.nextUrl.clone()
        url.pathname = getDefaultRedirectPath(userRole)
        return NextResponse.redirect(url)
      }

      // Redirect root path to role-specific dashboard
      if (pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = getDefaultRedirectPath(userRole)
        return NextResponse.redirect(url)
      }

      // Redirect old /protected route to new role-based routes
      if (pathname === '/protected') {
        const url = request.nextUrl.clone()
        url.pathname = getDefaultRedirectPath(userRole)
        return NextResponse.redirect(url)
      }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

// Helper function to get default redirect path based on role
function getDefaultRedirectPath(role: UserRole): string {
  switch (role) {
    case 'superadmin':
      return '/superadmin/dashboard'
    case 'health_admin':
      return '/health-admin/dashboard'
    case 'default':
    default:
      return '/dashboard'
  }
}
