import { type NextRequest, NextResponse } from "next/server"
import { SecurityManager } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      const response = NextResponse.json({ error: "No token provided" }, { status: 401 })
      return SecurityManager.setSecurityHeaders(response)
    }

    const decoded = SecurityManager.verifyToken(token)

    if (!decoded) {
      const response = NextResponse.json({ error: "Invalid token" }, { status: 401 })
      return SecurityManager.setSecurityHeaders(response)
    }

    // 驗證 IP 地址（可選的額外安全措施）
    const currentIP = SecurityManager.getClientIP(request)
    if (decoded.ip && decoded.ip !== currentIP) {
      console.warn(`IP mismatch for user ${decoded.email}: ${decoded.ip} vs ${currentIP}`)
      // 在生產環境中可能需要更嚴格的處理
    }

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
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    return SecurityManager.setSecurityHeaders(response)
  }
}
