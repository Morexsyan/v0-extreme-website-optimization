"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { createNewArticle, updateExistingArticle, deleteExistingArticle } from "@/app/actions/admin-actions"
import type { Article } from "@/lib/db-service"

interface ArticleManagerProps {
  initialArticles: Article[]
}

export function ArticleManager({ initialArticles }: ArticleManagerProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleCreateSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await createNewArticle(formData)

      if (result.error) {
        toast({
          title: "創建失敗",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.success && result.article) {
        setArticles((prev) => [result.article!, ...prev])
        setIsCreating(false)
        toast({
          title: "創建成功",
          description: "文章已成功創建",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Error creating article:", error)
      toast({
        title: "創建失敗",
        description: "創建文章時發生錯誤",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (id: string, formData: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await updateExistingArticle(id, formData)

      if (result.error) {
        toast({
          title: "更新失敗",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.success && result.article) {
        setArticles((prev) => prev.map((article) => (article.id === id ? result.article! : article)))
        setIsEditing(null)
        toast({
          title: "更新成功",
          description: "文章已成功更新",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Error updating article:", error)
      toast({
        title: "更新失敗",
        description: "更新文章時發生錯誤",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsSubmitting(true)

    try {
      const result = await deleteExistingArticle(id)

      if (result.error) {
        toast({
          title: "刪除失敗",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.success) {
        setArticles((prev) => prev.filter((article) => article.id !== id))
        setIsDeleting(null)
        toast({
          title: "刪除成功",
          description: "文章已成功刪除",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "刪除失敗",
        description: "刪除文章時發生錯誤",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-green-400">文章管理</h2>
        <motion.button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isCreating || isEditing !== null || isDeleting !== null}
        >
          ➕ 新增文章
        </motion.button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            className="mb-6 bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-xl font-bold text-green-400 mb-4">創建新文章</h3>
            <form action={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-green-300 mb-2">標題</label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
                  required
                />
              </div>
              <div>
                <label className="block text-green-300 mb-2">狀態</label>
                <select
                  name="status"
                  className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
                  required
                >
                  <option value="published">已發布</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
              <div>
                <label className="block text-green-300 mb-2">摘要</label>
                <textarea
                  name="excerpt"
                  rows={3}
                  className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60 resize-none"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-green-300 mb-2">內容</label>
                <textarea
                  name="content"
                  rows={6}
                  className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-green-300 mb-2">分類</label>
                <select
                  name="category"
                  className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
                  required
                >
                  <option value="Web Security">Web Security</option>
                  <option value="Cryptography">Cryptography</option>
                  <option value="Malware Analysis">Malware Analysis</option>
                  <option value="Exploit Development">Exploit Development</option>
                  <option value="Blockchain Security">Blockchain Security</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <motion.button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  取消
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      提交中...
                    </div>
                  ) : (
                    "創建文章"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-6">
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article.id}>
                <AnimatePresence>
                  {isEditing === article.id ? (
                    <motion.div
                      className="p-4 bg-gray-800/50 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <h3 className="text-lg font-bold text-green-400 mb-4">編輯文章</h3>
                      <form action={(formData) => handleEditSubmit(article.id, formData)} className="space-y-4">
                        <div>
                          <label className="block text-green-300 mb-2">標題</label>
                          <input
                            type="text"
                            name="title"
                            defaultValue={article.title}
                            className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-green-300 mb-2">狀態</label>
                          <select
                            name="status"
                            defaultValue={article.status}
                            className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
                            required
                          >
                            <option value="published">已發布</option>
                            <option value="draft">草稿</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-green-300 mb-2">摘要</label>
                          <textarea
                            name="excerpt"
                            rows={3}
                            defaultValue={article.excerpt}
                            className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60 resize-none"
                            required
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-green-300 mb-2">內容</label>
                          <textarea
                            name="content"
                            rows={6}
                            defaultValue={article.content || ""}
                            className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60 resize-none"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-green-300 mb-2">分類</label>
                          <select
                            name="category"
                            defaultValue={article.category}
                            className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-green-100 focus:outline-none focus:border-green-400/60"
                            required
                          >
                            <option value="Web Security">Web Security</option>
                            <option value="Cryptography">Cryptography</option>
                            <option value="Malware Analysis">Malware Analysis</option>
                            <option value="Exploit Development">Exploit Development</option>
                            <option value="Blockchain Security">Blockchain Security</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-4">
                          <motion.button
                            type="button"
                            onClick={() => setIsEditing(null)}
                            className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isSubmitting}
                          >
                            取消
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-black font-bold rounded-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <svg
                                  className="animate-spin h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                更新中...
                              </div>
                            ) : (
                              "更新文章"
                            )}
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex-1">
                        <h3 className="text-green-300 font-bold">{article.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span>📅 {formatDate(article.date)}</span>
                          <span>👁️ {article.views.toLocaleString()}</span>
                          <span>❤️ {article.likes.toLocaleString()}</span>
                          <span
                            className={`px-2 py-1 rounded ${
                              article.status === "published"
                                ? "bg-green-400/20 text-green-300"
                                : "bg-yellow-400/20 text-yellow-300"
                            }`}
                          >
                            {article.status === "published" ? "已發布" : "草稿"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => setIsEditing(article.id)}
                          className="px-3 py-2 bg-blue-400/20 text-blue-300 rounded border border-blue-400/30 hover:bg-blue-400 hover:text-black transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isSubmitting || isEditing !== null || isDeleting !== null}
                        >
                          編輯
                        </motion.button>
                        <motion.button
                          onClick={() => setIsDeleting(article.id)}
                          className="px-3 py-2 bg-red-400/20 text-red-300 rounded border border-red-400/30 hover:bg-red-400 hover:text-black transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isSubmitting || isEditing !== null || isDeleting !== null}
                        >
                          刪除
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete confirmation modal */}
                <AnimatePresence>
                  {isDeleting === article.id && (
                    <motion.div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="bg-black/90 border border-red-400/30 rounded-xl p-6 max-w-md mx-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                      >
                        <h3 className="text-xl font-bold text-red-400 mb-4">確認刪除</h3>
                        <p className="text-gray-300 mb-6">您確定要刪除文章「{article.title}」嗎？此操作無法撤銷。</p>
                        <div className="flex justify-end gap-4">
                          <motion.button
                            onClick={() => setIsDeleting(null)}
                            className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isSubmitting}
                          >
                            取消
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(article.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <svg
                                  className="animate-spin h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                刪除中...
                              </div>
                            ) : (
                              "確認刪除"
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-4">📝</div>
              <p>還沒有任何文章</p>
              <p className="text-sm mt-2">點擊上方的「新增文章」按鈕來創建第一篇文章</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
