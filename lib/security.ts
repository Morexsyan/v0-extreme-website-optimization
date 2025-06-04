// 只在服務器端使用的安全管理器
let bcrypt: any = null
let jwt: any = null
let CryptoJS: any = null

// 動態導入，只在服務器端執行
if (typeof window === "undefined") {
  try {
    bcrypt = require("bcryptjs")
    jwt = require("jsonwebtoken")
    CryptoJS = require("crypto-js")
  } catch (error) {
    console.warn("Server-side dependencies not available:", error.message)
  }
}

// 安全配置
const JWT_SECRET = process.env.JWT_SECRET || "fallback-jwt-secret-for-development"
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "fallback-encryption-key-for-development"
const TOKEN_EXPIRY = "24h"
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 分鐘

// 登錄嘗試追蹤
const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>()

export class SecurityManager {
  // 檢查是否在服務器端
  private static isServer(): boolean {
    return typeof window === "undefined"
  }

  // 密碼驗證
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    if (!this.isServer() || !bcrypt) {
      throw new Error("Password verification only available on server")
    }

    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
      console.error("Password verification error:", error)
      return false
    }
  }

  // 生成密碼哈希
  static async hashPassword(password: string): Promise<string> {
    if (!this.isServer() || !bcrypt) {
      throw new Error("Password hashing only available on server")
    }

    try {
      return await bcrypt.hash(password, 12)
    } catch (error) {
      console.error("Password hashing error:", error)
      throw new Error("Password hashing failed")
    }
  }

  // 生成安全的 JWT 令牌
  static generateToken(payload: any): string {
    if (!this.isServer() || !jwt) {
      throw new Error("Token generation only available on server")
    }

    try {
      return jwt.sign(
        {
          ...payload,
          iat: Math.floor(Date.now() / 1000),
          jti: this.generateSecureId(),
        },
        JWT_SECRET,
        {
          expiresIn: TOKEN_EXPIRY,
          issuer: "syan-portfolio",
          audience: "admin-panel",
          algorithm: "HS256",
        },
      )
    } catch (error) {
      console.error("Token generation error:", error)
      throw new Error("Token generation failed")
    }
  }

  // 驗證 JWT 令牌
  static verifyToken(token: string): any {
    if (!this.isServer() || !jwt) {
      throw new Error("Token verification only available on server")
    }

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
    if (!this.isServer() || !CryptoJS) {
      throw new Error("Encryption only available on server")
    }

    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
    } catch (error) {
      console.error("Encryption error:", error)
      throw new Error("Encryption failed")
    }
  }

  // 解密數據
  static decrypt(encryptedData: string): string {
    if (!this.isServer() || !CryptoJS) {
      throw new Error("Decryption only available on server")
    }

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
    if (this.isServer() && CryptoJS) {
      return CryptoJS.lib.WordArray.random(32).toString()
    }
    // 客戶端降級方案
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // 檢查登錄嘗試
  static checkLoginAttempts(ip: string): { allowed: boolean; remainingAttempts?: number; lockedUntil?: number } {
    if (!this.isServer()) {
      return { allowed: true }
    }

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
    if (!this.isServer()) {
      return
    }

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

  // 生成 CSRF 令牌
  static generateCSRFToken(): string {
    return this.generateSecureId()
  }

  // 清理過期的登錄嘗試記錄
  static cleanupLoginAttempts(): void {
    if (!this.isServer()) {
      return
    }

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

// 定期清理過期記錄（只在服務器端）
if (typeof window === "undefined" && typeof setInterval !== "undefined") {
  setInterval(
    () => {
      SecurityManager.cleanupLoginAttempts()
    },
    5 * 60 * 1000,
  ) // 每 5 分鐘清理一次
}
