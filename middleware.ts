import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // 檢查是否訪問 /writeup (單數)
  if (request.nextUrl.pathname === "/writeup") {
    // 重定向到 /writeups (複數)
    return NextResponse.redirect(new URL("/writeups", request.url))
  }

  // 其他常見的錯誤路徑重定向
  if (request.nextUrl.pathname === "/project") {
    return NextResponse.redirect(new URL("/projects", request.url))
  }

  if (request.nextUrl.pathname === "/write-up") {
    return NextResponse.redirect(new URL("/writeups", request.url))
  }

  if (request.nextUrl.pathname === "/write-ups") {
    return NextResponse.redirect(new URL("/writeups", request.url))
  }
}

export const config = {
  matcher: ["/writeup", "/project", "/write-up", "/write-ups"],
}
