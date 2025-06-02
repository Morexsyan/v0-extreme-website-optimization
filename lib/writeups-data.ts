// WriteUp 數據類型定義
export interface WriteUpTag {
  name: string
  color: string
}

export interface WriteUpAuthor {
  name: string
  avatar?: string
  bio?: string
  social?: {
    github?: string
    twitter?: string
    linkedin?: string
  }
}

export interface WriteUpMetrics {
  views: string
  likes: string
  shares?: string
  comments?: string
}

export interface WriteUpContent {
  summary: string
  tableOfContents?: string[]
  content: string
  codeExamples?: {
    language: string
    code: string
    description?: string
  }[]
  references?: {
    title: string
    url: string
    type: "article" | "documentation" | "video" | "book"
  }[]
}

export interface WriteUp {
  id: string
  title: string
  slug: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master"
  status: "Published" | "Draft" | "Updated" | "Featured"
  publishedDate: string
  lastUpdated?: string
  description: string
  tags: WriteUpTag[]
  readTime: string
  metrics: WriteUpMetrics
  author: WriteUpAuthor
  content: WriteUpContent
  featured?: boolean
  series?: {
    name: string
    part: number
    totalParts: number
  }
  prerequisites?: string[]
  relatedWriteups?: string[]
}

// 標籤顏色配置
export const TAG_COLORS: { [key: string]: string } = {
  "SQL Injection": "#e74c3c",
  "WAF Bypass": "#f39c12",
  "Web Security": "#e67e22",
  "Penetration Testing": "#c0392b",
  Quantum: "#9b59b6",
  Cryptography: "#3498db",
  QKD: "#2980b9",
  "Post-Quantum": "#8e44ad",
  AI: "#1abc9c",
  Malware: "#34495e",
  "Deep Learning": "#16a085",
  Automation: "#27ae60",
  "Zero-Day": "#d35400",
  Exploit: "#e74c3c",
  "Vulnerability Research": "#c0392b",
  "Reverse Engineering": "#7f8c8d",
  Blockchain: "#f1c40f",
  "Smart Contracts": "#f39c12",
  "Security Audit": "#e67e22",
  Solidity: "#d68910",
  "Memory Corruption": "#2c3e50",
  ROP: "#34495e",
  "Binary Exploitation": "#7f8c8d",
  Pwn: "#95a5a6",
}

// 分類配置
export const CATEGORIES = [
  "All",
  "Web Security",
  "Cryptography",
  "Malware Analysis",
  "Exploit Development",
  "Blockchain Security",
  "Binary Exploitation",
  "AI/ML Security",
  "Mobile Security",
  "Cloud Security",
  "IoT Security",
  "Forensics",
] as const

// 難度配置
export const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced", "Expert", "Master"] as const

// 導入模塊化的文章
import { advancedSqlInjectionWriteUp } from "./writeups/advanced-sql-injection"
import { quantumCryptographyWriteUp } from "./writeups/quantum-cryptography-implementation"

// WriteUps 數據庫 - 使用模塊化的文章
export const WRITEUPS_DATABASE: WriteUp[] = [advancedSqlInjectionWriteUp, quantumCryptographyWriteUp]

// 工具函數
export function getWriteUpBySlug(slug: string): WriteUp | undefined {
  return WRITEUPS_DATABASE.find((writeup) => writeup.slug === slug)
}

export function getWriteUpsByCategory(category: string): WriteUp[] {
  if (category === "All") return WRITEUPS_DATABASE
  return WRITEUPS_DATABASE.filter((writeup) => writeup.category === category)
}

export function getWriteUpsByDifficulty(difficulty: string): WriteUp[] {
  if (difficulty === "All") return WRITEUPS_DATABASE
  return WRITEUPS_DATABASE.filter((writeup) => writeup.difficulty === difficulty)
}

export function getFeaturedWriteUps(): WriteUp[] {
  return WRITEUPS_DATABASE.filter((writeup) => writeup.featured)
}

export function getRelatedWriteUps(writeupId: string): WriteUp[] {
  const writeup = WRITEUPS_DATABASE.find((w) => w.id === writeupId)
  if (!writeup?.relatedWriteups) return []

  return WRITEUPS_DATABASE.filter((w) => writeup.relatedWriteups?.includes(w.slug))
}

export function searchWriteUps(query: string): WriteUp[] {
  const lowercaseQuery = query.toLowerCase()
  return WRITEUPS_DATABASE.filter(
    (writeup) =>
      writeup.title.toLowerCase().includes(lowercaseQuery) ||
      writeup.description.toLowerCase().includes(lowercaseQuery) ||
      writeup.tags.some((tag) => tag.name.toLowerCase().includes(lowercaseQuery)) ||
      writeup.category.toLowerCase().includes(lowercaseQuery),
  )
}

export function getWriteUpStats() {
  return {
    total: WRITEUPS_DATABASE.length,
    categories: [...new Set(WRITEUPS_DATABASE.map((w) => w.category))].length,
    totalViews: WRITEUPS_DATABASE.reduce((sum, writeup) => sum + Number.parseInt(writeup.metrics.views || "0"), 0),
    totalLikes: WRITEUPS_DATABASE.reduce((sum, writeup) => sum + Number.parseInt(writeup.metrics.likes || "0"), 0),
  }
}

// 動態加載 WriteUps 函數
export async function loadWriteUps(): Promise<WriteUp[]> {
  // 目前直接返回靜態數據，未來可以擴展為動態加載
  return Promise.resolve(WRITEUPS_DATABASE)
}
