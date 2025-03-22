"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import TransitionEffect from "../components/transition-effect"

// Tipos
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type Position = { x: number; y: number }

export default function SnakeGame() {
  const router = useRouter()
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ])
  const [food, setFood] = useState<Position>({ x: 15, y: 10 })
  const [direction, setDirection] = useState<Direction>("RIGHT")
  const [speed, setSpeed] = useState(150) // ms por movimiento

  const gridSize = 20 // 20x20 grid
  const canvasSize = 400 // 400x400px
  const cellSize = canvasSize / gridSize

  const directionRef = useRef<Direction>("RIGHT")
  const gameActiveRef = useRef(false)

  // Actualizar refs cuando cambian los estados
  useEffect(() => {
    directionRef.current = direction
    gameActiveRef.current = gameActive
  }, [direction, gameActive])

  // Generar comida en posición aleatoria
  const generateFood = (): Position => {
    const x = Math.floor(Math.random() * gridSize)
    const y = Math.floor(Math.random() * gridSize)

    // Verificar que la comida no aparezca sobre la serpiente
    for (const segment of snake) {
      if (segment.x === x && segment.y === y) {
        return generateFood() // Recursión para generar nueva posición
      }
    }

    return { x, y }
  }

  // Reiniciar juego
  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ])
    setDirection("RIGHT")
    directionRef.current = "RIGHT"
    setFood(generateFood())
    setGameOver(false)
    setScore(0)
    setSpeed(150)
  }

  // Iniciar/detener juego
  const toggleGame = () => {
    if (gameOver) {
      resetGame()
    }
    setGameActive(!gameActive)
  }

  // Controles de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActiveRef.current) return

      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (directionRef.current !== "DOWN") {
            setDirection("UP")
          }
          break
        case "ArrowDown":
        case "s":
          if (directionRef.current !== "UP") {
            setDirection("DOWN")
          }
          break
        case "ArrowLeft":
        case "a":
          if (directionRef.current !== "RIGHT") {
            setDirection("LEFT")
          }
          break
        case "ArrowRight":
        case "d":
          if (directionRef.current !== "LEFT") {
            setDirection("RIGHT")
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Lógica principal del juego
  useEffect(() => {
    if (!gameActive || gameOver) return

    const moveSnake = () => {
      setSnake((prevSnake) => {
        // Crear copia del estado actual
        const newSnake = [...prevSnake]
        const head = { ...newSnake[0] }

        // Mover cabeza según dirección
        switch (direction) {
          case "UP":
            head.y -= 1
            break
          case "DOWN":
            head.y += 1
            break
          case "LEFT":
            head.x -= 1
            break
          case "RIGHT":
            head.x += 1
            break
        }

        // Verificar colisión con bordes
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
          setGameOver(true)
          setGameActive(false)
          if (score > highScore) {
            setHighScore(score)
          }
          return prevSnake
        }

        // Verificar colisión con el propio cuerpo
        for (let i = 0; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setGameOver(true)
            setGameActive(false)
            if (score > highScore) {
              setHighScore(score)
            }
            return prevSnake
          }
        }

        // Verificar si come comida
        if (head.x === food.x && head.y === food.y) {
          // Aumentar puntuación
          setScore((prev) => prev + 1)
          // Generar nueva comida
          setFood(generateFood())
          // Aumentar velocidad cada 5 puntos
          if ((score + 1) % 5 === 0 && speed > 50) {
            setSpeed((prev) => prev - 10)
          }
          // No eliminar la cola para que crezca
        } else {
          // Eliminar último segmento si no come
          newSnake.pop()
        }

        // Añadir nueva cabeza al principio
        newSnake.unshift(head)
        return newSnake
      })
    }

    const gameInterval = setInterval(moveSnake, speed)
    return () => clearInterval(gameInterval)
  }, [gameActive, gameOver, direction, food, speed, score, highScore, gridSize])

  // Efecto de parpadeo para el botón de inicio
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    if (!gameActive && !gameOver) {
      const interval = setInterval(() => {
        setBlink((prev) => !prev)
      }, 500)
      return () => clearInterval(interval)
    }
  }, [gameActive, gameOver])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <TransitionEffect />

      <motion.h1
        className="text-4xl font-bold text-green-400 mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Juego de la Serpiente
      </motion.h1>

      <motion.div
        className="mb-2 flex justify-between w-[400px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-green-400 font-bold">Puntos: {score}</div>
        <div className="text-yellow-400 font-bold">Récord: {highScore}</div>
      </motion.div>

      <motion.div
        className="relative w-[400px] h-[400px] bg-black border-4 border-green-500"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Cuadrícula de fondo */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20">
          {Array.from({ length: gridSize * gridSize }).map((_, index) => (
            <div key={index} className="border border-green-900 opacity-20" />
          ))}
        </div>

        {/* Serpiente */}
        {snake.map((segment, index) => (
          <motion.div
            key={index}
            className={`absolute bg-green-500 rounded-sm ${index === 0 ? "bg-green-400" : ""}`}
            style={{
              left: `${segment.x * cellSize}px`,
              top: `${segment.y * cellSize}px`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
        ))}

        {/* Comida */}
        <motion.div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: `${food.x * cellSize}px`,
            top: `${food.y * cellSize}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              "0px 0px 0px rgba(255, 0, 0, 0)",
              "0px 0px 10px rgba(255, 0, 0, 0.8)",
              "0px 0px 0px rgba(255, 0, 0, 0)",
            ],
          }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Overlay cuando el juego está pausado o terminado */}
        {(!gameActive || gameOver) && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <motion.div
              className="text-green-400 text-2xl font-mono text-center"
              animate={{ opacity: gameOver ? 1 : blink ? 1 : 0.3 }}
              transition={{ duration: 0.2 }}
            >
              {gameOver ? (
                <div>
                  <div className="text-3xl text-red-500 mb-4">JUEGO TERMINADO</div>
                  <div className="mb-2">Puntuación: {score}</div>
                  <div className="text-lg text-gray-400">Presiona Jugar de Nuevo</div>
                </div>
              ) : (
                "PRESIONA INICIAR"
              )}
            </motion.div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="mt-6 flex space-x-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
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
      </motion.div>

      <motion.div
        className="mt-4 text-gray-400 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p>Usa las flechas o WASD para controlar la serpiente</p>
        <p>Recoge la comida para crecer y aumentar tu puntuación</p>
      </motion.div>
    </div>
  )
}

