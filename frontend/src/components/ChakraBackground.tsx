'use client'

import { motion } from 'framer-motion'

export default function ChakraBackground() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 opacity-80 pointer-events-none select-none relative">
      
      {/* Background glow to make it stand out against white */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 via-transparent to-brand-gold/5 rounded-full blur-3xl scale-150"></div>

      <div className="w-full max-w-[400px] aspect-square relative text-brand-gold">
        
        {/* Central Logo / Sun */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full border border-brand-gold/50 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] bg-white/50 backdrop-blur-sm">
            <img src="/logo.png" alt="Center" className="w-10 h-10 object-contain opacity-80" />
          </div>
        </div>

        {/* Orbit Ring 1 */}
        <motion.div 
          className="absolute inset-4 rounded-full border-2 border-brand-gold/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {/* Orbital Node */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-orange/40 shadow-[0_0_10px_rgba(255,140,66,0.5)] border border-brand-orange/60" />
        </motion.div>

        {/* Orbit Ring 2 */}
        <motion.div 
          className="absolute inset-12 rounded-full border-2 border-dashed border-brand-gold/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {/* Orbital Node */}
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-navy/30 shadow-[0_0_10px_rgba(10,25,47,0.5)] border border-brand-navy/50" />
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-navy/30 shadow-[0_0_10px_rgba(10,25,47,0.5)] border border-brand-navy/50" />
        </motion.div>

        {/* Orbit Ring 3 */}
        <motion.div 
          className="absolute -inset-4 rounded-full border-[1.5px] border-brand-gold/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          {/* Orbital Nodes */}
          <div className="absolute -bottom-2 left-1/4 w-5 h-5 rounded-full bg-brand-purple/20 shadow-[0_0_15px_rgba(107,76,154,0.4)] border border-brand-purple/40 flex items-center justify-center">
             <div className="w-1 h-1 bg-white rounded-full opacity-50" />
          </div>
          <div className="absolute -top-2 right-1/4 w-2 h-2 rounded-full bg-brand-orange/50" />
        </motion.div>

        {/* Complex geometric SVG overlay slowly rotating */}
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
    </div>
  )
}
