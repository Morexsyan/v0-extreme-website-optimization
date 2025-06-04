import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 簡化的令牌驗證（避免在中間件中使用複雜的庫）
function verifyTokenSimple(token: string): boolean {
  try {
    // 基本的 JWT 格式檢查
    const parts = token.split(".")
    if (parts.length !== 3) {
      return false
    }

    // 解碼 payload（不驗證簽名，只檢查格式和過期時間）
    const payload = JSON.parse(atob(parts[1]))

    // 檢查是否過期
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return false
    }

    // 檢查基本字段
    if (!payload.email || !payload.role) {
      return false
    }

    return true
  } catch (error) {
    console.error("Token verification error in middleware:", error)
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 檢查是否訪問管理路由
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      // 沒有令牌，重定向到登錄頁面
      console.log("No token found, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // 簡單驗證令牌
    if (!verifyTokenSimple(token)) {
      // 令牌無效，重定向到登錄頁面
      console.log("Invalid token, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // 令牌有效，允許訪問
    return NextResponse.next()
  }

  // 檢查是否訪問 /writeup (單數)
  if (pathname === "/writeup") {
    return NextResponse.redirect(new URL("/writeups", request.url))
  }

  // 其他常見的錯誤路徑重定向
  if (pathname === "/project") {
    return NextResponse.redirect(new URL("/projects", request.url))
  }

  if (pathname === "/write-up") {
    return NextResponse.redirect(new URL("/writeups", request.url))
  }

  if (pathname === "/write-ups") {
    return NextResponse.redirect(new URL("/writeups", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/writeup", "/project", "/write-up", "/write-ups"],
}
