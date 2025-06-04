import { initializeDataFiles } from "@/lib/db-service"

async function initAdminData() {
  try {
    console.log("🔄 Initializing admin data files...")
    await initializeDataFiles()
    console.log("✅ Admin data files initialized successfully!")
    console.log("📁 Data files created in /data directory")
    console.log("🚀 You can now access the admin dashboard")
  } catch (error) {
    console.error("❌ Failed to initialize admin data:", error)
    process.exit(1)
  }
}

initAdminData()
