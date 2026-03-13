import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Các trang không cần bảo vệ
  const publicPages = ['/login', '/auth/callback']
  const isPublicPage = publicPages.some(page => request.nextUrl.pathname.startsWith(page))

  // Nếu chưa đăng nhập và cố vào trang bảo mật
  if (!user && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Nếu đã đăng nhập mà email không đúng (phòng hờ trường hợp vượt qua callback)
  if (user && user.email !== 'hoanhashi@gmail.com' && !isPublicPage) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login?error=UnauthorizedAccess', request.url))
  }

  // Nếu đã đăng nhập và là chính chủ mà cố vào trang login
  if (user && user.email === 'hoanhashi@gmail.com' && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
