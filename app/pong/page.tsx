"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import TransitionEffect from "../components/transition-effect"

export default function PongGame() {
  const router = useRouter()
  const [position, setPosition] = useState({ x: 300, y: 200 })
  const [velocity, setVelocity] = useState({ x: 5, y: 3 })
  const [paddle1Y, setPaddle1Y] = useState(150)
  const [paddle2Y, setPaddle2Y] = useState(150)
  const [score, setScore] = useState({ player1: 0, player2: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const maxScore = 5

  // Iniciar/detener juego
  const toggleGame = () => {
    if (gameOver) {
      // Reiniciar juego
      setScore({ player1: 0, player2: 0 })
      setGameOver(false)
      setWinner(null)
    }

    setGameActive(!gameActive)
    // Reiniciar posición de la pelota al centro
    setPosition({ x: 300, y: 200 })
    // Dirección aleatoria
    const randomDirection = Math.random() > 0.5 ? 1 : -1
    setVelocity({ x: 5 * randomDirection, y: 3 * (Math.random() > 0.5 ? 1 : -1) })
  }

  // Mover paddle1 con el mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current && gameActive && !gameOver) {
        const rect = canvasRef.current.getBoundingClientRect()
        const relativeY = e.clientY - rect.top
        if (relativeY > 50 && relativeY < 350) {
          setPaddle1Y(relativeY - 50)
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [gameActive, gameOver])

  // Controles de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive || gameOver) return

      const paddleSpeed = 20

      // Controles para paddle1 (jugador)
      if (e.key === "w" || e.key === "ArrowUp") {
        setPaddle1Y((prev) => Math.max(prev - paddleSpeed, 0))
      } else if (e.key === "s" || e.key === "ArrowDown") {
        setPaddle1Y((prev) => Math.min(prev + paddleSpeed, 300))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameActive, gameOver])

  // Lógica del juego
  useEffect(() => {
    if (!gameActive || gameOver) return

    const updateGame = () => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x
        let newY = prev.y + velocity.y
        let newVelX = velocity.x
        let newVelY = velocity.y

        // Rebote en paredes superior e inferior
        if (newY <= 0 || newY >= 400) {
          newVelY = -newVelY
        }

        // Colisión con paddle izquierdo
        if (newX <= 20 && newY > paddle1Y && newY < paddle1Y + 100) {
          newVelX = -newVelX
          newVelX *= 1.05 // Aumentar velocidad
          newVelX = Math.min(newVelX, 15) // Limitar velocidad máxima
        }

        // IA simple para paddle derecho
        const paddleSpeed = Math.abs(velocity.x) * 0.4 // Velocidad adaptativa
        const targetY = newY - 50 // Centro de la paleta

        if (paddle2Y < targetY - 10) {
          setPaddle2Y((prev) => Math.min(prev + paddleSpeed, 300))
        } else if (paddle2Y > targetY + 10) {
          setPaddle2Y((prev) => Math.max(prev - paddleSpeed, 0))
        }

        // Colisión con paddle derecho
        if (newX >= 580 && newY > paddle2Y && newY < paddle2Y + 100) {
          newVelX = -newVelX
          newVelX *= 1.05 // Aumentar velocidad
          newVelX = Math.max(newVelX, -15) // Limitar velocidad máxima
        }

        // Puntuación
        if (newX <= 0) {
          setScore((prev) => {
            const newScore = { ...prev, player2: prev.player2 + 1 }

            // Verificar si hay un ganador
            if (newScore.player2 >= maxScore) {
              setGameOver(true)
              setWinner("CPU")
              setGameActive(false)
            }

            return newScore
          })

          newX = 300
          newY = 200
          newVelX = 5
          newVelY = 3 * (Math.random() > 0.5 ? 1 : -1)
        } else if (newX >= 600) {
          setScore((prev) => {
            const newScore = { ...prev, player1: prev.player1 + 1 }

            // Verificar si hay un ganador
            if (newScore.player1 >= maxScore) {
              setGameOver(true)
              setWinner("Jugador")
              setGameActive(false)
            }

            return newScore
          })

          newX = 300
          newY = 200
          newVelX = -5
          newVelY = 3 * (Math.random() > 0.5 ? 1 : -1)
        }

        setVelocity({ x: newVelX, y: newVelY })
        return { x: newX, y: newY }
      })

      animationRef.current = requestAnimationFrame(updateGame)
    }

    animationRef.current = requestAnimationFrame(updateGame)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameActive, velocity, paddle1Y, paddle2Y, gameOver])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <TransitionEffect />

      <motion.h1
        className="text-4xl font-bold text-yellow-400 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Juego de Pong
      </motion.h1>

      <motion.div
        className="relative w-[600px] h-[400px] bg-black border-4 border-yellow-500 overflow-hidden"
        ref={canvasRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Línea central */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 border-dashed border-l border-white opacity-50" />

        {/* Paddle izquierdo (jugador) */}
        <motion.div
          className="absolute left-0 w-5 h-[100px] bg-white rounded-r-md"
          style={{ top: paddle1Y }}
          animate={{ top: paddle1Y }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        {/* Paddle derecho (IA) */}
        <motion.div
          className="absolute right-0 w-5 h-[100px] bg-white rounded-l-md"
          style={{ top: paddle2Y }}
          animate={{ top: paddle2Y }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        {/* Pelota */}
        <motion.div
          className="absolute w-4 h-4 bg-white rounded-full"
          style={{ left: position.x, top: position.y }}
          animate={{ left: position.x, top: position.y }}
          transition={{ type: "tween", duration: 0 }}
        />

        {/* Puntuación */}
        <div className="absolute top-4 left-0 w-full flex justify-center space-x-20 text-white text-3xl font-mono">
          <div>{score.player1}</div>
          <div>{score.player2}</div>
        </div>

        {/* Overlay cuando el juego está pausado o terminado */}
        {(!gameActive || gameOver) && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <motion.div
              className="text-white text-2xl font-mono text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {gameOver ? (
                <div>
                  <div className="text-3xl text-yellow-400 mb-4">Juego Terminado</div>
                  <div className="mb-4">¡{winner} Gana!</div>
                  <div className="text-lg text-gray-400">Haz clic en Jugar de Nuevo para reiniciar</div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">Haz clic en Iniciar para Jugar</div>
                  <div className="text-lg text-gray-400">Usa el ratón o las teclas W/S para moverte</div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>

      <div className="mt-8 flex space-x-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={toggleGame} className="bg-green-600 hover:bg-green-500">
            {gameActive ? "Pausar" : gameOver ? "Jugar de Nuevo" : "Iniciar"}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-500">
            Volver al Arcade
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="mt-4 text-gray-400 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p>Usa el ratón o las teclas W/S para mover tu paleta</p>
        <p>El primero en llegar a {maxScore} puntos gana</p>
      </motion.div>
    </div>
  )
}

