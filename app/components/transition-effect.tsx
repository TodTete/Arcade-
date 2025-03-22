"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function TransitionEffect() {
  const pathname = usePathname()
  const [isPresent, setIsPresent] = useState(false)

  useEffect(() => {
    setIsPresent(true)
    return () => setIsPresent(false)
  }, [pathname])

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-black"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed inset-0 z-40 bg-red-600"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
      />
    </>
  )
}

