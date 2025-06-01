"use client"

import React from "react"

import type { ReactNode } from "react"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text3D, Float, Sparkles, Environment } from "@react-three/drei"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import * as THREE from "three"
import { Suspense } from "react"
import { useRouter } from "next/navigation"
import LoadingStateManager from "@/lib/loading-state"
import PersistentHomeButton from "@/components/persistent-home-button"
import { useMobile } from "@/hooks/use-mobile"

// 量子粒子系統組件 - 優化版本
function QuantumParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { size, gl } = useThree()
  const [particleCount, setParticleCount] = useState(500)
  const isMobile = useMobile()

  useEffect(() => {
    // 根據設備類型調整粒子數量
    setParticleCount(isMobile ? 200 : 500)
  }, [isMobile])

  useFrame((state) => {
    if (!meshRef.current) return

    // 降低更新頻率，每兩幀更新一次
    if (Math.floor(state.clock.elapsedTime * 60) % 2 !== 0) return

    const time = state.clock.getElapsedTime()
    const dummy = new THREE.Object3D()

    // 減少循環次數，只更新一部分粒子
    const updateCount = Math.min(particleCount, 200)
    for (let i = 0; i < updateCount; i++) {
      const t = i / particleCount
      const radius = 8 + Math.sin(t * Math.PI * 6) * 1.5
      const angle = t * Math.PI * 24 + time * 0.3
      const y = Math.sin(t * Math.PI * 3 + time * 0.8) * 3

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      dummy.rotation.set(time * 1.5, time * 2, time)
      dummy.scale.setScalar(0.08 + Math.sin(t * 15 + time * 3) * 0.03)
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <octahedronGeometry args={[0.08]} />
      <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.3} transparent opacity={0.7} />
    </instancedMesh>
  )
}

function FloatingText({ text, position }: { text: string; position: [number, number, number] }) {
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    const checkFont = async () => {
      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("Font load timeout")), 3000)

          setTimeout(() => {
            clearTimeout(timeout)
            resolve(true)
          }, 1000)
        })
        setFontLoaded(true)
      } catch (error) {
        console.warn("Font loading failed, using fallback")
        setFontLoaded(false)
      }
    }

    checkFont()
  }, [])

  if (!fontLoaded) {
    // 降級方案：使用簡單的 3D 幾何體
    return (
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh position={position}>
          <boxGeometry args={[text.length * 0.5, 0.5, 0.2]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.2} />
        </mesh>
      </Float>
    )
  }

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <Text3D font="/fonts/helvetiker_regular.typeface.json" size={0.8} height={0.15} position={position} castShadow>
        {text}
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.2} />
      </Text3D>
    </Float>
  )
}

// 神經網絡可視化組件 - 簡化版本
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null)
  const [nodeCount, setNodeCount] = useState(30)
  const isMobile = useMobile()

  useEffect(() => {
    // 根據設備類型調整節點數量
    setNodeCount(isMobile ? 15 : 30)
  }, [isMobile])

  useFrame((state) => {
    if (groupRef.current) {
      // 降低旋轉速度，減少 GPU 負載
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02
    }
  })

  const nodes = Array.from({ length: Math.min(nodeCount, 20) }, (_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15] as [
      number,
      number,
      number,
    ],
  }))

  return (
    <group ref={groupRef}>
      {nodes.map((node) => (
        <mesh key={node.id} position={node.position}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.3} />
        </mesh>
      ))}
      <Sparkles count={50} scale={15} size={1.5} speed={0.3} color="#00ff88" />
    </group>
  )
}

// WebGL 錯誤處理組件
function WebGLErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false)
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [canvasKey, setCanvasKey] = useState(0)

  useEffect(() => {
    // 檢查 WebGL 支持
    const checkWebGLSupport = () => {
      try {
        // 創建一個臨時 canvas 來測試 WebGL 支持
        const testCanvas = document.createElement("canvas")
        testCanvas.width = 1
        testCanvas.height = 1

        const gl =
          testCanvas.getContext("webgl2") ||
          testCanvas.getContext("webgl") ||
          testCanvas.getContext("experimental-webgl")

        if (!gl) {
          console.warn("WebGL not supported")
          setIsWebGLSupported(false)
          return false
        }

        // 測試基本 WebGL 功能
        const renderer = gl.getParameter(gl.RENDERER)
        const vendor = gl.getParameter(gl.VENDOR)
        console.log("WebGL Renderer:", renderer)
        console.log("WebGL Vendor:", vendor)

        // 清理測試 canvas
        testCanvas.remove()
        return true
      } catch (e) {
        console.error("WebGL initialization error:", e)
        setIsWebGLSupported(false)
        return false
      }
    }

    const isSupported = checkWebGLSupport()

    if (isSupported) {
      // 監聽頁面可見性變化
      const handleVisibilityChange = () => {
        if (document.hidden) {
          console.log("Page hidden, preparing for context loss...")
        } else {
          console.log("Page visible, checking WebGL context...")
          // 強制重新創建 Canvas
          setCanvasKey((prev) => prev + 1)
        }
      }

      document.addEventListener("visibilitychange", handleVisibilityChange)

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    }
  }, [])

  const handleContextLost = () => {
    console.warn("WebGL context lost, attempting recovery...")
    setHasError(true)

    // 延遲恢復，給瀏覽器時間清理
    setTimeout(() => {
      setCanvasKey((prev) => prev + 1)
      setHasError(false)
    }, 2000)
  }

  const handleContextRestored = () => {
    console.log("WebGL context restored")
    setHasError(false)
  }

  if (!isWebGLSupported || hasError) {
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* 降級的 CSS 動畫背景 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div key={canvasKey}>
      {React.cloneElement(children as React.ReactElement, {
        onContextLost: handleContextLost,
        onContextRestored: handleContextRestored,
        canvasKey,
      })}
    </div>
  )
}

// 主要 3D 場景組件 - 優化版本
function Scene3D() {
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setIsMounted(true)

    // 檢測設備性能
    const checkPerformance = () => {
      if (typeof window === "undefined") return false

      const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4
      const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4

      return isMobile || isLowMemory || isSlowCPU
    }

    setIsLowPerformance(checkPerformance())
  }, [isMobile])

  // 如果不在客戶端，返回一個簡單的佔位符
  if (!isMounted) {
    return <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black">{/* 靜態背景 */}</div>
  }

  return (
    <WebGLErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 75 }}
        style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
        gl={{
          antialias: !isLowPerformance,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={isLowPerformance ? 1 : typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          // 設置 WebGL 上下文丟失處理
          const handleContextLost = (event: Event) => {
            event.preventDefault()
            console.warn("WebGL context lost, attempting to recover...")

            // 嘗試釋放資源
            if (typeof window !== "undefined") {
              // 清除任何可能的 GPU 密集型任務
              window.setTimeout(() => {
                console.log("Attempting to restore WebGL context...")
                // 觸發重新渲染
                const canvas = gl.domElement
                if (canvas.parentNode) {
                  const parent = canvas.parentNode
                  const nextSibling = canvas.nextSibling
                  parent.removeChild(canvas)
                  parent.insertBefore(canvas, nextSibling)
                }
              }, 500)
            }
          }

          const handleContextRestored = () => {
            console.log("WebGL context restored successfully")
          }

          gl.domElement.addEventListener("webglcontextlost", handleContextLost)
          gl.domElement.addEventListener("webglcontextrestored", handleContextRestored)

          // 設置更保守的 WebGL 參數
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
          gl.setClearColor(0x000000, 1)

          // 減少 WebGL 內存使用
          gl.compile(gl.getScene(), gl.getCamera())
        }}
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.1} />
          <pointLight position={[8, 8, 8]} intensity={0.8} color="#00ff88" />
          <pointLight position={[-8, -8, -8]} intensity={0.3} color="#0088ff" />

          {!isLowPerformance && <QuantumParticles />}
          {!isLowPerformance && <NeuralNetwork />}

          <FloatingText text="SYAN" position={[0, 2, 0]} />
          <FloatingText text="..." position={[0, 0.5, 0]} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </WebGLErrorBoundary>
  )
}

// 高級載入動畫 - 只在第一次訪問時顯示
function AdvancedLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ duration: 0.5, delay: progress >= 100 ? 0.5 : 0 }}
      style={{ pointerEvents: progress >= 100 ? "none" : "auto" }}
    >
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="rgba(0, 255, 136, 0.2)" strokeWidth="2" fill="none" />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#00ff88"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={283}
              strokeDashoffset={283 - (283 * progress) / 100}
              style={{
                filter: "drop-shadow(0 0 10px #00ff88)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-400">{Math.round(progress)}%</span>
          </div>
        </div>
        <motion.div
          className="text-green-400 font-mono text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          初始化量子系統...
        </motion.div>
      </div>
    </motion.div>
  )
}

// 導航組件 - 修復路由問題
function Navigation() {
  const [activeSection, setActiveSection] = useState("home")
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sections = [
    { id: "home", label: "首頁", icon: "🏠", route: "/" },
    { id: "about", label: "關於", icon: "👨‍💻", route: "/about" },
    { id: "skills", label: "技能", icon: "🧠", route: "#skills" },
    { id: "projects", label: "專案", icon: "🚀", route: "/projects" },
    { id: "writeups", label: "WriteUps", icon: "📝", route: "/writeups" },
    { id: "contact", label: "聯繫", icon: "📡", route: "/contact" },
  ]

  const handleNavigation = (section: any) => {
    setActiveSection(section.id)

    // 添加點擊反饋效果
    if (typeof document !== "undefined") {
      const ripple = document.createElement("div")
      ripple.className = "fixed w-4 h-4 bg-green-400 rounded-full pointer-events-none z-50 animate-ping"
      ripple.style.left = "50%"
      ripple.style.top = "50%"
      ripple.style.transform = "translate(-50%, -50%)"
      document.body.appendChild(ripple)

      setTimeout(() => {
        document.body.removeChild(ripple)
      }, 1000)
    }

    // 路由導航
    if (section.route.startsWith("#")) {
      // 如果是錨點，滾動到對應區域
      if (typeof document !== "undefined") {
        const element = document.querySelector(section.route)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    } else if (section.route === "/") {
      // 如果是首頁，滾動到頂部
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } else {
      // 導航到其他頁面
      router.push(section.route)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <motion.nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2 }}
    >
      <div className="bg-black/90 backdrop-blur-xl border border-green-400/30 rounded-full px-4 py-2 md:px-6 md:py-3">
        <div className="flex space-x-2 md:space-x-6">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              className={`relative px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition-all duration-300 ${
                activeSection === section.id
                  ? "text-black bg-green-400 shadow-lg shadow-green-400/50"
                  : "text-green-400 hover:text-green-300"
              }`}
              onClick={() => handleNavigation(section)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">{section.label}</span>
              <span className="sm:hidden text-lg">{section.icon}</span>
              {activeSection === section.id && (
                <motion.div
                  className="absolute inset-0 bg-green-400 rounded-full -z-10"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

// 終端機組件
function Terminal({ commands }: { commands: Array<{ prompt: string; output: string }> }) {
  const [currentCommand, setCurrentCommand] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentCommand < commands.length) {
      const command = commands[currentCommand]
      const fullText = command.output

      if (currentChar < fullText.length) {
        const timer = setTimeout(() => {
          setCurrentChar((prev) => prev + 1)
        }, 50)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setCurrentCommand((prev) => prev + 1)
          setCurrentChar(0)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [currentCommand, currentChar, commands])

  return (
    <div className="bg-black/90 border border-green-400/30 rounded-lg p-4 md:p-6 font-mono text-xs md:text-sm backdrop-blur-xl">
      <div className="flex items-center mb-4 pb-2 border-b border-green-400/30">
        <div className="flex space-x-2">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="ml-auto text-green-400 text-xs">syan:~$</span>
      </div>

      <div className="space-y-2">
        {commands.slice(0, currentCommand + 1).map((command, index) => (
          <div key={index}>
            <div className="text-green-400">
              <span className="text-green-300">syan:~$</span> {command.prompt}
            </div>
            <div className="text-green-200 ml-4 break-words">
              {index === currentCommand
                ? command.output.slice(0, currentChar) + (showCursor ? "█" : "")
                : command.output}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 技能卡片組件 - 優化手機版
function SkillCard({ skill, index }: { skill: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-xl p-4 md:p-6 h-full overflow-hidden">
        {/* 背景動畫 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* 邊框發光效果 */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: isHovered
              ? "0 0 30px rgba(0, 255, 136, 0.5), inset 0 0 30px rgba(0, 255, 136, 0.1)"
              : "0 0 0px rgba(0, 255, 136, 0)",
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10">
          <div className="text-3xl md:text-4xl mb-3 md:mb-4">{skill.icon}</div>

          <h3 className="text-lg md:text-xl font-bold text-green-400 mb-2">{skill.title}</h3>
          <p className="text-green-200 text-sm mb-3 md:mb-4 leading-relaxed">{skill.description}</p>

          <div className="flex flex-wrap gap-1 md:gap-2">
            {skill.technologies.map((tech: string, techIndex: number) => (
              <motion.span
                key={tech}
                className="px-2 py-1 bg-green-400/20 text-green-300 text-xs rounded-full border border-green-400/30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + techIndex * 0.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// 專案卡片組件 - 優化手機版
function ProjectCard({ project, index }: { project: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-black/70 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 md:p-8 h-full overflow-hidden">
        {/* 粒子效果背景 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <motion.h3
            className="text-xl md:text-2xl font-bold text-green-400 mb-4"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>

          <p className="text-green-200 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
            {project.technologies.map((tech: string, techIndex: number) => (
              <motion.span
                key={tech}
                className="px-2 md:px-3 py-1 bg-gradient-to-r from-green-400/20 to-blue-400/20 text-green-300 text-xs md:text-sm rounded-full border border-green-400/30"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <motion.button
            className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-black font-bold rounded-lg text-sm md:text-base"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 255, 136, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            查看詳情
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// 主要內容組件
function MainContent() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const terminalCommands = [
    { prompt: "whoami", output: "> 資訊安全研究,後端開發者 now:新莊高中教學" },
    {
      prompt: "ls -la skills/",
      output: ">Linux Python PHP MYSQL NOSQL",
    },
    {
      prompt: "cat flag.txt",
      output: '> "flag{自由_は_戦うことで_得られる}"',
    },
    { prompt: "quantum --status", output: "> ..." },
  ]

  const skills = [
    {
      icon: "⚛️",
      title: "前端工程",
      description: "前端技術與 3D 互動體驗",
      technologies: ["React 18", "Next.js 14", "WebGL", "Three.js", "WebGPU", "WASM"],
    },
    {
      icon: "🧠",
      title: "AI/ML",
      description: "人工智慧與機器學習應用開發",
      technologies: ["TensorFlow.js", "PyTorch", "Computer Vision", "NLP", "Neural Networks"],
    },
    {
      icon: "🔐",
      title: "資安研究",
      description: "網路安全與滲透測試專家",
      technologies: ["Penetration Testing", "CTF", "Malware Analysis", "Zero Trust"],
    },
    {
      icon: "⚡",
      title: "量子計算",
      description: "量子演算法與量子程式設計",
      technologies: ["Qiskit", "Quantum Algorithms", "Quantum ML", "Quantum Cryptography"],
    },
    {
      icon: "🌐",
      title: "區塊鏈",
      description: "去中心化應用與智能合約",
      technologies: ["Solidity", "Web3.js", "DeFi", "Smart Contracts", "IPFS"],
    },
    {
      icon: "☁️",
      title: "雲端架構",
      description: "雲原生應用與微服務架構",
      technologies: ["AWS", "GCP", "Kubernetes", "Docker", "Terraform", "Serverless"],
    },
  ]

  const projects = [
    {
      title: "discord bot ai自主開發自身新功能",
      description: "減少開發discord bot重複無意義的行為",
      technologies: ["ai", "python", "discord.py"],
    },
    {
      title: "ios密碼漏洞發現&利用",
      description: "透過研究漏洞深入了解ios系統",
      technologies: ["ios"],
    },
    {
      title: "phonk音樂利用算法生成",
      description: "phonk time!!!!!",
      technologies: ["music", "discord.py", "python"],
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6">
        <motion.div
          className="text-center z-10 w-full max-w-6xl"
          style={{ y }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6"
            style={{
              background: "linear-gradient(45deg, #00ff88, #0088ff, #00ff88)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            SYAN
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-green-300 mb-6 md:mb-8 font-mono px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
          >
            Red Team Exercise & Developer
          </motion.p>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3.5 }}
          >
            <Terminal commands={terminalCommands} />
          </motion.div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-12 md:py-20 px-4 md:px-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-12 md:mb-16 text-green-400"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            now learning
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {skills.map((skill, index) => (
              <SkillCard key={skill.title} skill={skill} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-12 md:mb-16 text-green-400"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            專案
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8 text-green-400"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            聯繫方式
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-green-300 mb-8 md:mb-12 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            無限可能 探索極限
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              { icon: "📧", label: "Email", href: "mailto:morex.rick@gmail.com" },
              { icon: "🐙", label: "GitHub", href: "https://github.com/Morexsyan" },
              { icon: "💼", label: "discord", href: "https://discord.gg/c8nMcwqq" },
              { icon: "▶️", label: "???", href: "https://youtu.be/dQw4w9WgXcQ?si=NA7T3ghlW_o3Lseg" },
            ].map((contact, index) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-black/60 backdrop-blur-xl border border-green-400/30 rounded-full text-green-400 hover:text-black hover:bg-green-400 transition-all duration-300 text-sm md:text-base"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg md:text-xl">{contact.icon}</span>
                <span className="font-mono">{contact.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}

// 主要應用組件
function QuantumPortfolio() {
  // 確保所有 hooks 都在組件頂部調用
  const [showLoader, setShowLoader] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const scrollIndicatorScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    setIsMounted(true)
    const loadingManager = LoadingStateManager.getInstance()
    setShowLoader(loadingManager.shouldShowLoading())
  }, [])

  const handleLoadingComplete = () => {
    if (typeof window !== "undefined") {
      const loadingManager = LoadingStateManager.getInstance()
      loadingManager.setLoaded()
      setShowLoader(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* 3D 背景場景 */}
      {isMounted ? (
        <Scene3D />
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      )}

      {/* 載入動畫 */}
      {isMounted && showLoader && <AdvancedLoader onComplete={handleLoadingComplete} />}

      {/* 導航 */}
      {isMounted && <Navigation />}

      {/* 常駐首頁按鈕 */}
      {isMounted && <PersistentHomeButton />}

      {/* 主要內容 */}
      {isMounted ? (
        <MainContent />
      ) : (
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 text-green-400">SYAN</h1>
            <p className="text-lg md:text-xl lg:text-2xl text-green-300 mb-6 md:mb-8 font-mono px-4">
              Red Team Exercise & Developer
            </p>
          </div>
        </div>
      )}

      {/* 滾動指示器 */}
      {isMounted && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-400 z-50"
          style={{ scaleX: scrollIndicatorScale }}
          transformTemplate={({ scaleX }) => `scaleX(${scaleX})`}
        />
      )}
    </div>
  )
}

export default QuantumPortfolio
