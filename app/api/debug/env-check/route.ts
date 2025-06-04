import { NextResponse } from "next/server"

export async function GET() {
  // 只在開發環境中提供此端點
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 })
  }

  const envCheck = {
    JWT_SECRET: !!process.env.JWT_SECRET,
    JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
    ENCRYPTION_KEY: !!process.env.ENCRYPTION_KEY,
    ENCRYPTION_KEY_LENGTH: process.env.ENCRYPTION_KEY?.length || 0,
    NODE_ENV: process.env.NODE_ENV,
  }

  console.log("Environment check:", envCheck)

  return NextResponse.json({
    message: "Environment variables check",
    ...envCheck,
  })
}
