import bcrypt from "bcryptjs"

async function generatePasswordHash() {
  const password = "S126027981"
  const saltRounds = 12

  console.log("正在生成密碼哈希...")
  console.log("密碼:", password)
  console.log("Salt rounds:", saltRounds)

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log("生成的哈希值:", hash)

    // 驗證哈希是否正確
    const isValid = await bcrypt.compare(password, hash)
    console.log("哈希驗證結果:", isValid)

    // 測試與現有哈希的比較
    const existingHash = "$2a$12$Ht5QsKYt0uKEYbRFRLTx8.t9UZQjZIyJJDCGpRwAX1OBcKTQB.Etu"
    const isExistingValid = await bcrypt.compare(password, existingHash)
    console.log("現有哈希驗證結果:", isExistingValid)

    return hash
  } catch (error) {
    console.error("生成哈希時發生錯誤:", error)
    return null
  }
}

generatePasswordHash()
