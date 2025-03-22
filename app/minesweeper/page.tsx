"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import TransitionEffect from "../components/transition-effect"

// Tipos para el juego
type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

type Grid = Cell[][]

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.01,
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

// Colores para los números
const numberColors: Record<number, string> = {
  1: "text-blue-500",
  2: "text-green-500",
  3: "text-red-500",
  4: "text-purple-600",
  5: "text-yellow-600",
  6: "text-cyan-600",
  7: "text-black",
  8: "text-gray-600",
}

export default function Minesweeper() {
  const router = useRouter()
  const [grid, setGrid] = useState<Grid | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [difficulty, setDifficulty] = useState<string | null>(null)

  // Función para crear un tablero vacío
  const createEmptyGrid = (rows: number, cols: number, minesCount: number): Grid => {
    // Crear tablero vacío
    const grid: Grid = []
    for (let i = 0; i < rows; i++) {
      grid.push(
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          })),
      )
    }

    // Colocar minas aleatoriamente
    let minesPlaced = 0
    while (minesPlaced < minesCount) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)

      if (!grid[row][col].isMine) {
        grid[row][col].isMine = true
        minesPlaced++
      }
    }

    return grid
  }

  // Función para contar minas adyacentes
  const countAdjacentMines = (grid: Grid, row: number, col: number): number => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    let count = 0
    for (const [dx, dy] of directions) {
      const newRow = row + dx
      const newCol = col + dy
      if (
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length &&
        grid[newRow][newCol].isMine
      ) {
        count++
      }
    }

    return count
  }

  // Función para revelar celdas recursivamente
  const revealCells = (grid: Grid, row: number, col: number) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    const stack = [[row, col]]
    while (stack.length) {
      const [currentRow, currentCol] = stack.pop()!
      if (grid[currentRow][currentCol].isRevealed) continue

      grid[currentRow][currentCol].isRevealed = true
      const adjacentMines = countAdjacentMines(grid, currentRow, currentCol)
      grid[currentRow][currentCol].adjacentMines = adjacentMines

      if (adjacentMines === 0) {
        for (const [dx, dy] of directions) {
          const newRow = currentRow + dx
          const newCol = currentCol + dy
          if (
            newRow >= 0 &&
            newRow < grid.length &&
            newCol >= 0 &&
            newCol < grid[0].length &&
            !grid[newRow][newCol].isRevealed &&
            !grid[newRow][newCol].isFlagged
          ) {
            stack.push([newRow, newCol])
          }
        }
      }
    }
  }

  // Función para verificar victoria
  const checkWin = (grid: Grid): boolean => {
    for (const row of grid) {
      for (const cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          return false
        }
      }
    }
    return true
  }

  // Función para revelar todas las minas
  const revealAllMines = () => {
    if (!grid) return

    setGrid((prevGrid) => {
      if (!prevGrid) return prevGrid

      const newGrid = prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isRevealed: cell.isMine || cell.isRevealed,
        })),
      )
      return newGrid
    })
  }

  // Función para iniciar juego
  const handleStartGame = (rows: number, cols: number, minesCount: number, diff: string) => {
    setGrid(createEmptyGrid(rows, cols, minesCount))
    setIsGameOver(false)
    setIsWin(false)
    setDifficulty(diff)
  }

  // Función para manejar clic izquierdo
  const handleClick = (row: number, col: number) => {
    if (!grid || isGameOver || grid[row][col].isFlagged) return

    if (grid[row][col].isMine) {
      revealAllMines()
      setIsGameOver(true)
    } else {
      setGrid((prevGrid) => {
        if (!prevGrid) return prevGrid

        const newGrid = JSON.parse(JSON.stringify(prevGrid))
        revealCells(newGrid, row, col)

        if (checkWin(newGrid)) {
          setIsGameOver(true)
          setIsWin(true)
        }

        return newGrid
      })
    }
  }

  // Función para manejar clic derecho (bandera)
  const handleRightClick = (event: React.MouseEvent, row: number, col: number) => {
    event.preventDefault()
    if (!grid || isGameOver || grid[row][col].isRevealed) return

    setGrid((prevGrid) => {
      if (!prevGrid) return prevGrid

      const newGrid = JSON.parse(JSON.stringify(prevGrid))
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged
      return newGrid
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <TransitionEffect />

      <motion.h1
        className="text-4xl font-bold text-yellow-400 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Buscaminas
      </motion.h1>

      {!grid && (
        <motion.div
          className="flex flex-col items-center bg-gray-800 p-6 rounded-lg border-2 border-yellow-500"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-yellow-300 mb-6">Selecciona Dificultad</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleStartGame(8, 8, 10, "fácil")}
                className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 text-lg"
              >
                Fácil
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleStartGame(12, 12, 20, "medio")}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-6 py-3 text-lg"
              >
                Medio
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleStartGame(16, 16, 40, "difícil")}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 text-lg"
              >
                Difícil
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {grid && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex justify-between items-center w-full">
            <div className="text-yellow-300 font-bold">MODO {difficulty?.toUpperCase()}</div>
            <div className="text-yellow-300 font-bold">
              {isGameOver ? (isWin ? "¡HAS GANADO! 🏆" : "¡JUEGO TERMINADO! 💣") : "ENCUENTRA LAS MINAS"}
            </div>
          </div>

          <motion.div
            className="bg-gray-700 p-2 rounded-lg border-2 border-yellow-500 overflow-auto max-w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${grid[0].length}, minmax(30px, 1fr))`,
                gridTemplateRows: `repeat(${grid.length}, minmax(30px, 1fr))`,
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      flex items-center justify-center cursor-pointer w-8 h-8 sm:w-10 sm:h-10
                      ${cell.isRevealed ? "bg-gray-300" : "bg-gray-500 hover:bg-gray-400 active:bg-gray-300"}
                      ${cell.isRevealed && cell.isMine ? "bg-red-300" : ""}
                      rounded-sm font-bold
                    `}
                    variants={itemVariants}
                    whileHover={!cell.isRevealed ? { scale: 1.05 } : {}}
                    whileTap={!cell.isRevealed ? { scale: 0.95 } : {}}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                  >
                    {cell.isRevealed && cell.isMine && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        className="text-xl"
                      >
                        💣
                      </motion.div>
                    )}
                    {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
                      <motion.span
                        className={`font-bold ${numberColors[cell.adjacentMines]}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        {cell.adjacentMines}
                      </motion.span>
                    )}
                    {cell.isFlagged && !cell.isRevealed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        className="text-lg"
                      >
                        🚩
                      </motion.div>
                    )}
                  </motion.div>
                )),
              )}
            </div>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isGameOver && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    if (grid) {
                      handleStartGame(
                        grid.length,
                        grid[0].length,
                        grid.flat().filter((cell) => cell.isMine).length,
                        difficulty || "medio",
                      )
                    }
                  }}
                  className="bg-green-600 hover:bg-green-500"
                >
                  Jugar de Nuevo
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  setGrid(null)
                  setIsGameOver(false)
                  setIsWin(false)
                }}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Cambiar Dificultad
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-500">
                Volver al Arcade
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-4 text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Clic izquierdo para revelar, clic derecho para marcar
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

