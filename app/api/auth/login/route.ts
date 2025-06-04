import { type NextRequest, NextResponse } from "next/server"
import { SecurityManager } from "@/lib/security"
import bcrypt from "bcryptjs"

// 管理員憑證
const ADMIN_EMAIL = "morex.rick@gmail.com"
// 重新生成的密碼哈希 - 使用更簡單的方法
const ADMIN_PASSWORD = "S126027981"

export async function POST(request: NextRequest) {
  try {
    const clientIP = SecurityManager.getClientIP(request)
    console.log("Login attempt from IP:", clientIP)

    // 檢查登錄嘗試限制
    const attemptCheck = SecurityManager.checkLoginAttempts(clientIP)
    if (!attemptCheck.allowed) {
      console.log("Login blocked due to too many attempts")
      const response = NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
          lockedUntil: attemptCheck.lockedUntil,
        },
        { status: 429 },
      )
      return SecurityManager.setSecurityHeaders(response)
    }

    const body = await request.json()
    const { email, password } = body

    console.log("Login attempt:", { email, passwordLength: password?.length })

    // 輸入驗證
    if (!email || !password) {
      console.log("Missing email or password")
      SecurityManager.recordLoginAttempt(clientIP, false)
      const response = NextResponse.json({ error: "Email and password are required" }, { status: 400 })
      return SecurityManager.setSecurityHeaders(response)
    }

    // 驗證管理員憑證
    const isValidEmail = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
    console.log("Email validation:", { provided: email, expected: ADMIN_EMAIL, isValid: isValidEmail })

    // 直接比較密碼（臨時調試）
    const isValidPassword = password === ADMIN_PASSWORD
    console.log("Password validation:", { provided: password, expected: ADMIN_PASSWORD, isValid: isValidPassword })

    // 也嘗試 bcrypt 比較（如果有哈希值）
    let bcryptValid = false
    try {
      const hashedPassword = "$2a$12$Ht5QsKYt0uKEYbRFRLTx8.t9UZQjZIyJJDCGpRwAX1OBcKTQB.Etu"
      bcryptValid = await bcrypt.compare(password, hashedPassword)
      console.log("Bcrypt validation:", bcryptValid)
    } catch (error) {
      console.error("Bcrypt error:", error)
    }

    const isValidAdmin = isValidEmail && (isValidPassword || bcryptValid)
    console.log("Final validation result:", { isValidEmail, isValidPassword, bcryptValid, isValidAdmin })

    if (!isValidAdmin) {
      console.log("Invalid credentials provided")
      SecurityManager.recordLoginAttempt(clientIP, false)

      // 添加延遲以防止時序攻擊
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = NextResponse.json(
        {
          error: "Invalid credentials",
          remainingAttempts: attemptCheck.remainingAttempts ? attemptCheck.remainingAttempts - 1 : 0,
          debug:
            process.env.NODE_ENV === "development"
              ? {
                  emailMatch: isValidEmail,
                  passwordMatch: isValidPassword,
                  bcryptMatch: bcryptValid,
                }
              : undefined,
        },
        { status: 401 },
      )
      return SecurityManager.setSecurityHeaders(response)
    }

    // 成功登錄
    console.log("Login successful")
    SecurityManager.recordLoginAttempt(clientIP, true)

    // 檢查環境變量
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables")
      const response = NextResponse.json({ error: "Server configuration error" }, { status: 500 })
      return SecurityManager.setSecurityHeaders(response)
    }

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
    const response = NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
    return SecurityManager.setSecurityHeaders(response)
  }
}
