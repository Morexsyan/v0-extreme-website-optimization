import { type NextRequest, NextResponse } from "next/server"
import { SecurityManager } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    // 從 cookie 中獲取令牌
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // 驗證令牌
    const decoded = SecurityManager.verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // 檢查令牌是否過期
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < now) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 })
    }

    // 返回用戶信息
    const response = NextResponse.json({
      success: true,
      user: {
        email: decoded.email,
        role: decoded.role,
        loginTime: decoded.loginTime,
      },
    })

    return SecurityManager.setSecurityHeaders(response)
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Token verification failed" }, { status: 401 })
  }
}
