import jwt from "jsonwebtoken"

// 獲取環境變量，如果不存在則使用默認值
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development-only"
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "fallback-encryption-key-for-development"

export class SimpleSecurityManager {
  // 生成 JWT 令牌
  static generateToken(payload: any): string {
    try {
      return jwt.sign(
        {
          ...payload,
          iat: Math.floor(Date.now() / 1000),
          jti: this.generateSecureId(),
        },
        JWT_SECRET,
        {
          expiresIn: "24h",
          issuer: "syan-portfolio",
          audience: "admin-panel",
          algorithm: "HS256",
        },
      )
    } catch (error) {
      console.error("Token generation error:", error)
      throw new Error("Failed to generate token")
    }
  }

  // 驗證 JWT 令牌
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: "syan-portfolio",
        audience: "admin-panel",
        algorithms: ["HS256"],
      })
    } catch (error) {
      console.error("Token verification error:", error)
      return null
    }
  }

  // 生成安全 ID
  static generateSecureId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // 簡單的密碼驗證
  static verifyPassword(inputPassword: string, expectedPassword: string): boolean {
    return inputPassword === expectedPassword
  }

  // 獲取客戶端 IP
  static getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")

    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }

    if (realIP) {
      return realIP
    }

    return "unknown"
  }

  // 設置安全響應標頭
  static setSecurityHeaders(response: Response): Response {
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

    return response
  }
}
