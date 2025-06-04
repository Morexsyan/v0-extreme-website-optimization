import { type NextRequest, NextResponse } from "next/server"
import { SecurityManager } from "@/lib/security"
import bcrypt from "bcryptjs"

// 管理員憑證（從環境變量讀取）
const ADMIN_EMAIL = "morex.rick@gmail.com"
// 使用bcrypt生成的S126027981的哈希值
const ADMIN_PASSWORD_HASH = "$2a$12$Ht5QsKYt0uKEYbRFRLTx8.t9UZQjZIyJJDCGpRwAX1OBcKTQB.Etu"

export async function POST(request: NextRequest) {
  try {
    const clientIP = SecurityManager.getClientIP(request)

    // 檢查登錄嘗試限制
    const attemptCheck = SecurityManager.checkLoginAttempts(clientIP)
    if (!attemptCheck.allowed) {
      const response = NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
          lockedUntil: attemptCheck.lockedUntil,
        },
        { status: 429 },
      )
      return SecurityManager.setSecurityHeaders(response)
    }

    const { email, password, csrfToken } = await request.json()

    // 輸入驗證
    if (!email || !password) {
      SecurityManager.recordLoginAttempt(clientIP, false)
      const response = NextResponse.json({ error: "Email and password are required" }, { status: 400 })
      return SecurityManager.setSecurityHeaders(response)
    }

    // 驗證管理員憑證
    const isValidEmail = email === ADMIN_EMAIL
    const isValidPassword = isValidEmail ? await bcrypt.compare(password, ADMIN_PASSWORD_HASH) : false
    const isValidAdmin = isValidEmail && isValidPassword

    if (!isValidAdmin) {
      SecurityManager.recordLoginAttempt(clientIP, false)

      // 添加延遲以防止時序攻擊
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = NextResponse.json(
        {
          error: "Invalid credentials",
          remainingAttempts: attemptCheck.remainingAttempts ? attemptCheck.remainingAttempts - 1 : 0,
        },
        { status: 401 },
      )
      return SecurityManager.setSecurityHeaders(response)
    }

    // 成功登錄
    SecurityManager.recordLoginAttempt(clientIP, true)

    // 生成 JWT 令牌
    const token = SecurityManager.generateToken({
      email,
      role: "admin",
      ip: clientIP,
      loginTime: Date.now(),
    })

    // 生成新的 CSRF 令牌
    const newCSRFToken = SecurityManager.generateCSRFToken()

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      csrfToken: newCSRFToken,
    })

    // 設置安全的 HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 小時
      path: "/",
    })

    response.cookies.set("csrf-token", newCSRFToken, {
      httpOnly: false, // 需要在客戶端訪問
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    })

    return SecurityManager.setSecurityHeaders(response)
  } catch (error) {
    console.error("Login error:", error)
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    return SecurityManager.setSecurityHeaders(response)
  }
}
