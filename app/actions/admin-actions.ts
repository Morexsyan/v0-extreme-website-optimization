"use server"

import { revalidatePath } from "next/cache"
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getStats,
  updateStats,
  addActivity,
  getActivities, // Declared the missing variable here
} from "@/lib/db-service"
import type { Project } from "@/lib/db-service"

// Article actions
export async function fetchArticles() {
  return await getArticles()
}

export async function createNewArticle(formData: FormData) {
  const title = formData.get("title") as string
  const status = formData.get("status") as "published" | "draft"
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const category = formData.get("category") as string

  if (!title || !status || !excerpt || !category) {
    return { error: "Missing required fields" }
  }

  try {
    const newArticle = await createArticle({
      title,
      status,
      views: 0,
      likes: 0,
      date: new Date().toISOString(),
      excerpt,
      content,
      author: "Syan",
      category,
    })

    // Add activity
    await addActivity({
      action: `新文章已創建: ${title}`,
      time: new Date().toISOString(),
      type: "success",
    })

    // Update stats
    const stats = await getStats()
    await updateStats({ totalArticles: stats.totalArticles + 1 })

    revalidatePath("/admin")
    return { success: true, article: newArticle }
  } catch (error) {
    console.error("Error creating article:", error)
    return { error: "Failed to create article" }
  }
}

export async function updateExistingArticle(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const status = formData.get("status") as "published" | "draft"
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const category = formData.get("category") as string

  if (!title || !status || !excerpt || !category) {
    return { error: "Missing required fields" }
  }

  try {
    const updatedArticle = await updateArticle(id, {
      title,
      status,
      excerpt,
      content,
      category,
    })

    if (!updatedArticle) {
      return { error: "Article not found" }
    }

    // Add activity
    await addActivity({
      action: `文章已更新: ${title}`,
      time: new Date().toISOString(),
      type: "info",
    })

    revalidatePath("/admin")
    return { success: true, article: updatedArticle }
  } catch (error) {
    console.error("Error updating article:", error)
    return { error: "Failed to update article" }
  }
}

export async function deleteExistingArticle(id: string) {
  try {
    const article = await getArticles().then((articles) => articles.find((a) => a.id === id))
    if (!article) {
      return { error: "Article not found" }
    }

    const success = await deleteArticle(id)
    if (!success) {
      return { error: "Failed to delete article" }
    }

    // Add activity
    await addActivity({
      action: `文章已刪除: ${article.title}`,
      time: new Date().toISOString(),
      type: "warning",
    })

    // Update stats
    const stats = await getStats()
    await updateStats({ totalArticles: Math.max(0, stats.totalArticles - 1) })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting article:", error)
    return { error: "Failed to delete article" }
  }
}

// Project actions
export async function fetchProjects() {
  return await getProjects()
}

export async function createNewProject(formData: FormData) {
  const name = formData.get("name") as string
  const status = formData.get("status") as "active" | "completed" | "development"
  const description = formData.get("description") as string
  const technologiesStr = formData.get("technologies") as string
  const progress = Number.parseInt((formData.get("progress") as string) || "0", 10)

  if (!name || !status || !description) {
    return { error: "Missing required fields" }
  }

  try {
    const technologies = technologiesStr.split(",").map((tech) => tech.trim())

    const newProject = await createProject({
      name,
      status,
      progress: Math.min(100, Math.max(0, progress)),
      description,
      technologies,
      startDate: new Date().toISOString(),
    })

    // Add activity
    await addActivity({
      action: `新專案已創建: ${name}`,
      time: new Date().toISOString(),
      type: "success",
    })

    // Update stats
    const stats = await getStats()
    await updateStats({ totalProjects: stats.totalProjects + 1 })

    revalidatePath("/admin")
    return { success: true, project: newProject }
  } catch (error) {
    console.error("Error creating project:", error)
    return { error: "Failed to create project" }
  }
}

export async function updateExistingProject(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const status = formData.get("status") as "active" | "completed" | "development"
  const description = formData.get("description") as string
  const technologiesStr = formData.get("technologies") as string
  const progress = Number.parseInt((formData.get("progress") as string) || "0", 10)

  if (!name || !status || !description) {
    return { error: "Missing required fields" }
  }

  try {
    const technologies = technologiesStr.split(",").map((tech) => tech.trim())

    const updates: Partial<Project> = {
      name,
      status,
      progress: Math.min(100, Math.max(0, progress)),
      description,
      technologies,
    }

    // If project is completed, add end date
    if (status === "completed") {
      updates.endDate = new Date().toISOString()
    }

    const updatedProject = await updateProject(id, updates)

    if (!updatedProject) {
      return { error: "Project not found" }
    }

    // Add activity
    await addActivity({
      action: `專案已更新: ${name}`,
      time: new Date().toISOString(),
      type: "info",
    })

    revalidatePath("/admin")
    return { success: true, project: updatedProject }
  } catch (error) {
    console.error("Error updating project:", error)
    return { error: "Failed to update project" }
  }
}

export async function deleteExistingProject(id: string) {
  try {
    const project = await getProjects().then((projects) => projects.find((p) => p.id === id))
    if (!project) {
      return { error: "Project not found" }
    }

    const success = await deleteProject(id)
    if (!success) {
      return { error: "Failed to delete project" }
    }

    // Add activity
    await addActivity({
      action: `專案已刪除: ${project.name}`,
      time: new Date().toISOString(),
      type: "warning",
    })

    // Update stats
    const stats = await getStats()
    await updateStats({ totalProjects: Math.max(0, stats.totalProjects - 1) })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { error: "Failed to delete project" }
  }
}

// Stats and activities
export async function fetchDashboardData() {
  try {
    const [stats, articles, projects, activities] = await Promise.all([
      getStats(),
      getArticles(),
      getProjects(),
      getActivities(5), // Using the declared variable here
    ])

    return { stats, articles, projects, activities }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return { error: "Failed to fetch dashboard data" }
  }
}

export async function recordPageView() {
  try {
    const stats = await getStats()
    await updateStats({ totalViews: stats.totalViews + 1 })

    // Add activity occasionally (not for every view to avoid spam)
    if (Math.random() > 0.8) {
      await addActivity({
        action: "頁面被瀏覽",
        time: new Date().toISOString(),
        type: "info",
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error recording page view:", error)
    return { error: "Failed to record page view" }
  }
}

export async function clearSecurityAlerts() {
  try {
    await updateStats({ securityAlerts: 0 })

    await addActivity({
      action: "安全警報已清除",
      time: new Date().toISOString(),
      type: "success",
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error clearing security alerts:", error)
    return { error: "Failed to clear security alerts" }
  }
}

// System settings
export async function updateSystemSettings(formData: FormData) {
  const siteTitle = formData.get("siteTitle") as string
  const siteDescription = formData.get("siteDescription") as string
  const enableTwoFactor = formData.get("enableTwoFactor") === "on"
  const autoLogout = formData.get("autoLogout") === "on"

  try {
    // In a real app, these would be saved to a settings file or database
    // For now, we'll just record the activity
    await addActivity({
      action: "系統設置已更新",
      time: new Date().toISOString(),
      type: "success",
      details: `標題: ${siteTitle}, 描述: ${siteDescription}, 雙因素認證: ${enableTwoFactor}, 自動登出: ${autoLogout}`,
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error updating system settings:", error)
    return { error: "Failed to update system settings" }
  }
}
