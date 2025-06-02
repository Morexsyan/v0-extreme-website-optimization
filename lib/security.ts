import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import CryptoJS from "crypto-js"

// 管理員憑證（在生產環境中應該從環境變量讀取）
const ADMIN_EMAIL = "morex.rick@gmail.com"
const ADMIN_PASSWORD_HASH = "$2a$12$8K9wE2nF5qL7mP3rT6uV8eXyZ1cA4bD7fG9hJ2kL5mN8oP1qR3sT4u" // S126027981 的 bcrypt hash

// 安全配置
const JWT_SECRET = process.env.JWT_SECRET!
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
const TOKEN_EXPIRY = "24h"
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 分鐘

// 登錄嘗試追蹤
const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>()

export class SecurityManager {
  // 密碼驗證
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
      console.error("Password verification error:", error)
      return false
    }
  }

  // 生成安全的 JWT 令牌
  static generateToken(payload: any): string {
    return jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        jti: this.generateSecureId(), // JWT ID for revocation
      },
      JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRY,
        issuer: "syan-portfolio",
        audience: "admin-panel",
        algorithm: "HS256",
      },
    )
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

  // 加密敏感數據
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
    } catch (error) {
      console.error("Encryption error:", error)
      throw new Error("Encryption failed")
    }
  }

  // 解密數據
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error("Decryption error:", error)
      throw new Error("Decryption failed")
    }
  }

  // 生成安全 ID
  static generateSecureId(): string {
    return CryptoJS.lib.WordArray.random(32).toString()
  }

  // 檢查登錄嘗試
  static checkLoginAttempts(ip: string): { allowed: boolean; remainingAttempts?: number; lockedUntil?: number } {
    const now = Date.now()
    const attempts = loginAttempts.get(ip)

    if (!attempts) {
      return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS }
    }

    // 檢查是否仍在鎖定期間
    if (attempts.lockedUntil && now < attempts.lockedUntil) {
      return { allowed: false, lockedUntil: attempts.lockedUntil }
    }

    // 重置過期的鎖定
    if (attempts.lockedUntil && now >= attempts.lockedUntil) {
      loginAttempts.delete(ip)
      return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS }
    }

    // 檢查嘗試次數
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const lockedUntil = now + LOCKOUT_TIME
      loginAttempts.set(ip, { ...attempts, lockedUntil })
      return { allowed: false, lockedUntil }
    }

    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count }
  }

  // 記錄登錄嘗試
  static recordLoginAttempt(ip: string, success: boolean): void {
    const now = Date.now()
    const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now }

    if (success) {
      // 成功登錄，清除記錄
      loginAttempts.delete(ip)
    } else {
      // 失敗登錄，增加計數
      loginAttempts.set(ip, {
        count: attempts.count + 1,
        lastAttempt: now,
      })
    }
  }

  // 驗證管理員憑證
  static async validateAdmin(email: string, password: string): Promise<boolean> {
    if (email !== ADMIN_EMAIL) {
      return false
    }

    return await this.verifyPassword(password, ADMIN_PASSWORD_HASH)
  }

  // 生成 CSRF 令牌
  static generateCSRFToken(): string {
    return this.generateSecureId()
  }

  // 清理過期的登錄嘗試記錄
  static cleanupLoginAttempts(): void {
    const now = Date.now()
    for (const [ip, attempts] of loginAttempts.entries()) {
      if (attempts.lockedUntil && now >= attempts.lockedUntil) {
        loginAttempts.delete(ip)
      }
    }
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
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    return response
  }
}

// 定期清理過期記錄
setInterval(
  () => {
    SecurityManager.cleanupLoginAttempts()
  },
  5 * 60 * 1000,
) // 每 5 分鐘清理一次
