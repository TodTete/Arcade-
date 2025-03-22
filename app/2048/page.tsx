"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import TransitionEffect from "../components/transition-effect"

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
}

// Colores para los diferentes valores de las celdas
const tileColors: Record<number, string> = {
  2: "bg-yellow-100 text-gray-800",
  4: "bg-yellow-200 text-gray-800",
  8: "bg-yellow-300 text-gray-800",
  16: "bg-orange-300 text-white",
  32: "bg-orange-400 text-white",
  64: "bg-orange-500 text-white",
  128: "bg-yellow-400 text-white",
  256: "bg-yellow-500 text-white",
  512: "bg-yellow-600 text-white",
  1024: "bg-red-500 text-white",
  2048: "bg-red-600 text-white",
}

type Board = (number | null)[][]

export default function Game2048() {
  const router = useRouter()
  const [board, setBoard] = useState<Board>([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameActive, setGameActive] = useState(false)

  // Inicializar juego
  const initGame = () => {
    const newBoard = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    // Añadir dos números iniciales
    addRandomTile(addRandomTile(newBoard))

    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    setGameActive(true)
  }

  // Añadir un número aleatorio (2 o 4) en una celda vacía
  const addRandomTile = (currentBoard: Board): Board => {
    const emptyCells: [number, number][] = []

    // Encontrar todas las celdas vacías
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === null) {
          emptyCells.push([i, j])
        }
      }
    }

    // Si no hay celdas vacías, devolver el tablero sin cambios
    if (emptyCells.length === 0) return currentBoard

    // Elegir una celda vacía aleatoria
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]

    // Asignar 2 o 4 (90% probabilidad de 2, 10% probabilidad de 4)
    currentBoard[row][col] = Math.random() < 0.9 ? 2 : 4

    return currentBoard
  }

  // Verificar si el juego ha terminado
  const checkGameOver = (currentBoard: Board): boolean => {
    // Verificar si hay celdas vacías
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === null) return false
      }
    }

    // Verificar si hay movimientos posibles
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === currentBoard[i][j + 1]) return false
      }
    }

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 3; i++) {
        if (currentBoard[i][j] === currentBoard[i + 1][j]) return false
      }
    }

    return true
  }

  // Verificar si el jugador ha ganado (tiene un 2048)
  const checkWin = (currentBoard: Board): boolean => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 2048) return true
      }
    }
    return false
  }

  // Mover y combinar celdas en una dirección
  const move = (direction: "up" | "down" | "left" | "right") => {
    if (!gameActive || gameOver) return

    let boardChanged = false
    let newScore = score

    // Crear copia profunda del tablero
    const newBoard: Board = JSON.parse(JSON.stringify(board))

    // Función para mover y combinar una fila o columna
    const moveAndMerge = (line: (number | null)[]): (number | null)[] => {
      // Eliminar nulos
      const nonNullTiles = line.filter((tile) => tile !== null)

      // Combinar tiles adyacentes del mismo valor
      const mergedTiles: (number | null)[] = []
      for (let i = 0; i < nonNullTiles.length; i++) {
        if (i < nonNullTiles.length - 1 && nonNullTiles[i] === nonNullTiles[i + 1]) {
          const mergedValue = nonNullTiles[i]! * 2
          mergedTiles.push(mergedValue)
          newScore += mergedValue
          i++ // Saltar el siguiente tile ya que se combinó
        } else {
          mergedTiles.push(nonNullTiles[i])
        }
      }

      // Rellenar con nulos hasta tener 4 elementos
      while (mergedTiles.length < 4) {
        mergedTiles.push(null)
      }

      return mergedTiles
    }

    // Aplicar movimiento según la dirección
    if (direction === "left") {
      for (let i = 0; i < 4; i++) {
        const originalRow = [...newBoard[i]]
        const newRow = moveAndMerge(originalRow)
        newBoard[i] = newRow

        // Verificar si la fila cambió
        if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
          boardChanged = true
        }
      }
    } else if (direction === "right") {
      for (let i = 0; i < 4; i++) {
        const originalRow = [...newBoard[i]].reverse()
        const newRow = moveAndMerge(originalRow).reverse()
        newBoard[i] = newRow

        // Verificar si la fila cambió
        if (JSON.stringify([...newBoard[i]].reverse()) !== JSON.stringify(originalRow)) {
          boardChanged = true
        }
      }
    } else if (direction === "up") {
      for (let j = 0; j < 4; j++) {
        const originalCol = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]]
        const newCol = moveAndMerge(originalCol)

        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = newCol[i]
        }

        // Verificar si la columna cambió
        if (JSON.stringify(originalCol) !== JSON.stringify(newCol)) {
          boardChanged = true
        }
      }
    } else if (direction === "down") {
      for (let j = 0; j < 4; j++) {
        const originalCol = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]].reverse()
        const newCol = moveAndMerge(originalCol).reverse()

        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = newCol[i]
        }

        // Verificar si la columna cambió
        if (
          JSON.stringify([newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]].reverse()) !==
          JSON.stringify(originalCol)
        ) {
          boardChanged = true
        }
      }
    }

    // Si el tablero cambió, añadir un nuevo número y actualizar el estado
    if (boardChanged) {
      addRandomTile(newBoard)
      setBoard(newBoard)
      setScore(newScore)

      // Actualizar high score si es necesario
      if (newScore > highScore) {
        setHighScore(newScore)
      }

      // Verificar si el jugador ha ganado
      if (checkWin(newBoard)) {
        setGameWon(true)
        setGameActive(false)
      }
      // Verificar si el juego ha terminado
      else if (checkGameOver(newBoard)) {
        setGameOver(true)
        setGameActive(false)
      }
    }
  }

  // Controles de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive) return

      switch (e.key) {
        case "ArrowUp":
          move("up")
          break
        case "ArrowDown":
          move("down")
          break
        case "ArrowLeft":
          move("left")
          break
        case "ArrowRight":
          move("right")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameActive, board, score, highScore])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <TransitionEffect />

      <motion.h1
        className="text-4xl font-bold text-yellow-400 mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Juego 2048
      </motion.h1>

      <motion.div
        className="mb-4 flex justify-between w-[400px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-yellow-300 font-bold">Puntos: {score}</div>
        <div className="text-yellow-300 font-bold">Récord: {highScore}</div>
      </motion.div>

      <motion.div
        className="w-[400px] h-[400px] bg-gray-700 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="w-full h-full grid grid-cols-4 grid-rows-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {board.flat().map((value, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-center rounded-lg ${
                value ? tileColors[value] : "bg-gray-500 bg-opacity-30"
              }`}
              variants={itemVariants}
              animate={
                value
                  ? {
                      scale: [1, 1.1, 1],
                      transition: { duration: 0.3 },
                    }
                  : {}
              }
            >
              <span className={`text-2xl font-bold ${value && value >= 8 ? "text-white" : ""}`}>{value || ""}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Overlay cuando el juego está terminado */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={`text-3xl font-bold mb-4 ${gameWon ? "text-yellow-400" : "text-red-500"}`}>
                {gameWon ? "¡Has Ganado!" : "¡Juego Terminado!"}
              </h2>
              <p className="text-white mb-6">{gameWon ? "¡Has alcanzado 2048!" : "No hay más movimientos posibles."}</p>
              <p className="text-yellow-300 text-xl mb-6">Puntuación: {score}</p>
            </motion.div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="mt-8 flex space-x-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={initGame} className="bg-green-600 hover:bg-green-500">
            {gameActive ? "Reiniciar" : "Nuevo Juego"}
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
        <p>Usa las teclas de flecha para mover las fichas</p>
        <p>¡Combina números iguales para llegar a 2048!</p>
      </motion.div>
    </div>
  )
}

