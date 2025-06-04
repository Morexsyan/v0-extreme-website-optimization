import { type NextRequest, NextResponse } from "next/server"
import { SimpleSecurityManager } from "@/lib/security-simple"

// 管理員憑證
const ADMIN_EMAIL = "morex.rick@gmail.com"
const ADMIN_PASSWORD = "S126027981"

export async function POST(request: NextRequest) {
  try {
    console.log("Simple login attempt started")

    const body = await request.json()
    const { email, password } = body

    console.log("Login data:", {
      email,
      passwordProvided: !!password,
      passwordLength: password?.length,
    })

    // 基本驗證
    if (!email || !password) {
      console.log("Missing credentials")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // 簡單的憑證檢查
    const isValidEmail = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
    const isValidPassword = password === ADMIN_PASSWORD

    console.log("Validation results:", { isValidEmail, isValidPassword })

    if (!isValidEmail || !isValidPassword) {
      console.log("Invalid credentials")
      return NextResponse.json(
        {
          error: "Invalid credentials",
          debug: {
            emailMatch: isValidEmail,
            passwordMatch: isValidPassword,
            expectedEmail: ADMIN_EMAIL,
            providedEmail: email,
          },
        },
        { status: 401 },
      )
    }

    // 生成令牌
    console.log("Generating token...")
    const token = SimpleSecurityManager.generateToken({
      email,
      role: "admin",
      loginTime: Date.now(),
    })

    console.log("Token generated successfully")

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    })

    // 設置 cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    })

    console.log("Login completed successfully")
    return response
  } catch (error) {
    console.error("Simple login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
