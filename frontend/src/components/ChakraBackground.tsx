'use client'

import { motion } from 'framer-motion'

export default function ChakraBackground() {
  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden opacity-70 pointer-events-none select-none">
      
      {/* Background glow to make it stand out against white */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-navy/5"></div>

      {/* 1. TOP RIGHT: Small Geometric Mandala */}
      <div className="absolute -top-10 -right-20 w-96 h-96 text-brand-gold opacity-50">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="100" cy="100" r="80" strokeDasharray="5,5" />
          {[...Array(6)].map((_, i) => (
            <path
              key={i}
              d="M100 20 L 120 80 L 180 100 L 120 120 L 100 180 L 80 120 L 20 100 L 80 80 Z"
              transform={`rotate(${i * 30} 100 100)`}
              className="opacity-30"
            />
          ))}
        </motion.svg>
      </div>

      {/* 2. BOTTOM RIGHT: Main Planetary System with Logo */}
      <div className="absolute -bottom-20 -right-10 w-[500px] h-[500px] text-brand-gold">
        {/* Central Logo / Sun */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-20 h-20 rounded-full border border-brand-gold/50 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] bg-white/50 backdrop-blur-sm">
            <img src="/logo.png" alt="Center" className="w-12 h-12 object-contain opacity-90" />
          </div>
        </div>

        {/* Orbit Ring 1 */}
        <motion.div 
          className="absolute inset-16 rounded-full border-[1.5px] border-brand-gold/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-orange/50 shadow-[0_0_10px_rgba(255,140,66,0.6)] border border-brand-orange/80" />
        </motion.div>

        {/* Orbit Ring 2 */}
        <motion.div 
          className="absolute inset-28 rounded-full border-2 border-dashed border-brand-gold/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-navy/40 shadow-[0_0_10px_rgba(10,25,47,0.5)] border border-brand-navy/60" />
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-navy/40 shadow-[0_0_10px_rgba(10,25,47,0.5)] border border-brand-navy/60" />
        </motion.div>

        {/* Orbit Ring 3 */}
        <motion.div 
          className="absolute -inset-4 rounded-full border-[1.5px] border-brand-gold/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute -bottom-2 left-1/4 w-6 h-6 rounded-full bg-brand-purple/30 shadow-[0_0_15px_rgba(107,76,154,0.5)] border border-brand-purple/60 flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
          </div>
        </motion.div>

        {/* Geometric Overlay */}
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full absolute inset-0 opacity-30"
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d="M100 10 C 120 40, 120 70, 100 100 C 80 70, 80 40, 100 10"
              transform={`rotate(${i * 30} 100 100)`}
              className="opacity-70"
            />
          ))}
        </motion.svg>
      </div>

      {/* 3. CENTER LEFT: Massive Slow Cosmic Ring */}
      <div className="absolute top-1/3 -left-40 w-[800px] h-[800px] text-brand-navy opacity-10">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {[...Array(12)].map((_, i) => (
            <circle key={`c-${i}`} cx="100" cy="100" r={30 + (i * 6)} className="opacity-40" />
          ))}
          {[...Array(6)].map((_, i) => (
            <circle key={`cn-${i}`} cx="100" cy={40 + (i * 12)} r="2" fill="currentColor" />
          ))}
        </motion.svg>
      </div>

      {/* 4. BOTTOM LEFT: Small rapid orbital cluster */}
      <div className="absolute bottom-20 left-10 w-48 h-48 text-brand-orange opacity-40">
        <motion.div 
          className="w-full h-full rounded-full border border-brand-orange/30 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,140,66,0.8)]" />
          <motion.div 
            className="absolute inset-6 rounded-full border border-dashed border-brand-orange/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-navy" />
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
}
