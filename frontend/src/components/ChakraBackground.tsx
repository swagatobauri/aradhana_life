'use client'

import { motion } from 'framer-motion'

export default function ChakraBackground() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 opacity-20 pointer-events-none select-none">
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full max-w-[400px] aspect-square text-brand-gold"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        {/* Outer Circle */}
        <circle cx="100" cy="100" r="90" />
        <circle cx="100" cy="100" r="85" />
        
        {/* Petals */}
        {[...Array(12)].map((_, i) => (
          <path
            key={i}
            d="M100 15 C 120 40, 120 70, 100 100 C 80 70, 80 40, 100 15"
            transform={`rotate(${i * 30} 100 100)`}
            className="opacity-60"
          />
        ))}
        
        {/* Inner Mandala */}
        {[...Array(24)].map((_, i) => (
          <line
            key={`l1-${i}`}
            x1="100"
            y1="15"
            x2="100"
            y2="30"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}
        
        {/* Deep Center */}
        <circle cx="100" cy="100" r="20" className="opacity-80" />
        {[...Array(8)].map((_, i) => (
          <path
            key={`inner-${i}`}
            d="M100 80 C 105 90, 105 100, 100 100 C 95 100, 95 90, 100 80"
            transform={`rotate(${i * 45} 100 100)`}
          />
        ))}
      </motion.svg>
    </div>
  )
}
