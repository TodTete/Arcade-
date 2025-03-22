"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

const games = [
  { name: "Pong", path: "/pong", emoji: "🏓" },
  { name: "2048", path: "/2048", emoji: "🔢" },
  { name: "Serpiente", path: "/snake", emoji: "🐍" },
  { name: "Buscaminas", path: "/minesweeper", emoji: "💣" },
]

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  hover: {
    scale: 1.05,
    boxShadow: [
      "0px 0px 15px rgba(255, 255, 0, 0.2)",
      "0px 0px 20px rgba(255, 255, 0, 0.8)",
      "0px 0px 15px rgba(255, 255, 0, 0.2)",
    ],
    border: "2px solid #fde047",
    transition: {
      scale: { type: "spring", stiffness: 400, damping: 10 },
      boxShadow: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" },
      border: { duration: 0 },
    },
  },
  tap: { scale: 0.95 },
}

const buttonVariants = {
  hover: {
    scale: 1.1,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.9 },
}

const controlButtonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)" },
  press: { scale: 0.9 },
}

export default function Home() {
  const router = useRouter()
  const [scanlines, setScanlines] = useState(true)
  const [glitch, setGlitch] = useState(false)

  // Efecto de glitch aleatorio
  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 150)
      },
      Math.random() * 5000 + 3000,
    )

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className="relative mx-auto w-full flex justify-center items-center h-screen bg-black overflow-hidden">
      {/* Efecto de luz de neón alrededor del arcade */}
      <div
        className="absolute w-[340px] sm:w-[440px] h-[650px] bg-transparent rounded-2xl opacity-50 animate-pulse"
        style={{
          boxShadow: "0 0 40px 5px rgba(255, 0, 0, 0.7), 0 0 80px 10px rgba(255, 0, 0, 0.5)",
          filter: "blur(4px)",
        }}
      />

      <motion.div
        className="relative mx-auto w-[320px] sm:w-[420px] bg-gray-900 shadow-xl border-8 border-red-600 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ borderRadius: "30px" }}
      >
        {/* Arcade Header */}
        <motion.div
          className="h-20 bg-red-700 flex justify-center items-center shadow-lg"
          style={{ borderTopLeftRadius: "22px", borderTopRightRadius: "22px" }}
          animate={{
            boxShadow: [
              "0px 5px 15px rgba(255, 0, 0, 0.3)",
              "0px 5px 25px rgba(255, 0, 0, 0.7)",
              "0px 5px 15px rgba(255, 0, 0, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.h1
            className="text-yellow-400 font-bold font-mono text-2xl md:text-3xl"
            animate={{
              textShadow: [
                "0px 0px 5px rgba(255, 204, 0, 0.5)",
                "0px 0px 15px rgba(255, 204, 0, 0.8)",
                "0px 0px 5px rgba(255, 204, 0, 0.5)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            ARCADE RETRO
          </motion.h1>
        </motion.div>

        {/* Arcade Screen */}
        <div className="relative h-[450px] bg-black border-8 border-gray-800 rounded-lg m-4 p-4 shadow-inner overflow-auto">
          {/* Efecto de scanlines */}
          {scanlines && (
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.3) 50%)",
                backgroundSize: "100% 4px",
              }}
            />
          )}

          {/* Efecto de glitch */}
          {glitch && (
            <motion.div
              className="absolute inset-0 bg-cyan-500 mix-blend-screen z-20 opacity-10"
              animate={{ x: [-10, 5, -2, 0], opacity: [0.1, 0.3, 0.1, 0] }}
              transition={{ duration: 0.2 }}
            />
          )}

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-0" variants={containerVariants}>
            {games.map((game) => (
              <motion.div key={game.name} variants={cardVariants} whileHover="hover" whileTap="tap">
                <Card className="bg-gray-800 border-2 border-yellow-500 text-center shadow-md overflow-hidden">
                  <CardContent className="p-5">
                    <motion.div
                      className="text-4xl"
                      animate={{
                        rotate: [0, 5, 0, -5, 0],
                        scale: [1, 1.1, 1, 1.1, 1],
                      }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      {game.emoji}
                    </motion.div>
                    <motion.h2
                      className="text-yellow-300 font-bold text-xl mt-2"
                      animate={{
                        textShadow: [
                          "0px 0px 0px rgba(255, 204, 0, 0)",
                          "0px 0px 10px rgba(255, 204, 0, 0.8)",
                          "0px 0px 0px rgba(255, 204, 0, 0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {game.name}
                    </motion.h2>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button
                        onClick={() => router.push(game.path)}
                        className="mt-3 bg-red-600 hover:bg-red-500 text-white font-bold"
                      >
                        {game.name}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Arcade Controls */}
        <div
          className="h-24 bg-red-700 flex justify-center items-center shadow-lg"
          style={{ borderBottomLeftRadius: "22px", borderBottomRightRadius: "22px" }}
        >
          <motion.div
            className="w-16 h-16 bg-black rounded-full flex justify-center items-center shadow-md border-4 border-gray-700"
            whileHover="hover"
            whileTap="press"
            variants={controlButtonVariants}
          >
            <motion.div
              className="w-10 h-10 bg-red-500 rounded-full shadow-md"
              whileTap={{ scale: 0.8 }}
              animate={{
                boxShadow: [
                  "0px 0px 0px rgba(255, 0, 0, 0)",
                  "0px 0px 15px rgba(255, 0, 0, 0.8)",
                  "0px 0px 0px rgba(255, 0, 0, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
          <div className="flex space-x-4 ml-8">
            {["blue", "green", "yellow", "red"].map((color, index) => (
              <motion.div
                key={color}
                className={`w-8 h-8 bg-${color}-500 rounded-full shadow-md border-2 border-${color}-600`}
                whileHover="hover"
                whileTap="press"
                variants={controlButtonVariants}
                animate={{
                  boxShadow: [
                    `0px 0px 0px rgba(${color === "blue" ? "0, 0, 255" : color === "green" ? "0, 255, 0" : color === "yellow" ? "255, 255, 0" : "255, 0, 0"}, 0)`,
                    `0px 0px 15px rgba(${color === "blue" ? "0, 0, 255" : color === "green" ? "0, 255, 0" : color === "yellow" ? "255, 255, 0" : "255, 0, 0"}, 0.8)`,
                    `0px 0px 0px rgba(${color === "blue" ? "0, 0, 255" : color === "green" ? "0, 255, 0" : color === "yellow" ? "255, 255, 0" : "255, 0, 0"}, 0)`,
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
              />
            ))}
          </div>
        </div>

        {/* Toggle para efectos CRT */}
        <motion.div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2" whileHover={{ scale: 1.1 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScanlines(!scanlines)}
            className="bg-gray-800 text-yellow-300 border-yellow-500 hover:bg-gray-700"
          >
            {scanlines ? "Efecto CRT: ON" : "Efecto CRT: OFF"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

