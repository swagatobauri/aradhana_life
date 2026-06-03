'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'

const PHRASES = [
  "Aligning the stars...",
  "Decoding your karma...",
  "Drawing your cosmic blueprint...",
  "Reading the planetary positions...",
  "Unveiling the path..."
]

export default function ChartLoadingAnimation() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const { isGeneratingChart, setIsGeneratingChart, chartData } = useChatStore()

  // Cycle through phrases
  useEffect(() => {
    if (!isGeneratingChart) return
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isGeneratingChart])

  // Stop animation once chartData is received (with a slight dramatic delay)
  useEffect(() => {
    if (chartData && isGeneratingChart) {
      const timeout = setTimeout(() => {
        setIsGeneratingChart(false)
      }, 3000) // 3 seconds extra for dramatic effect after data arrives
      return () => clearTimeout(timeout)
    }
  }, [chartData, isGeneratingChart, setIsGeneratingChart])

  return (
    <AnimatePresence>
      {isGeneratingChart && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg overflow-hidden"
        >
          {/* Sacred Geometry Background Spinners */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-[800px] h-[800px] border-[1px] border-brand-navy rounded-full flex items-center justify-center"
            >
              <div className="w-[600px] h-[600px] border-[1px] border-brand-navy rotate-45 flex items-center justify-center">
                <div className="w-[400px] h-[400px] border-[1px] border-brand-navy rounded-full" />
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-[1000px] h-[1000px] border-[2px] border-brand-orange rounded-full border-dashed"
            />
          </div>

          {/* Central Animated Element */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Pulsing Lotus/Orb Logo */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(235, 71, 27, 0)",
                  "0 0 40px 10px rgba(235, 71, 27, 0.2)",
                  "0 0 0 0 rgba(235, 71, 27, 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full flex items-center justify-center mb-12 bg-white/50 backdrop-blur-sm"
            >
              <img src="/logo.png" alt="Aradhana Loading" className="w-20 h-20 object-contain" />
            </motion.div>

            {/* Changing Text */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={phraseIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="font-serif text-2xl md:text-3xl text-brand-navy font-light tracking-wide text-center px-4"
              >
                {PHRASES[phraseIndex]}
              </motion.h2>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
