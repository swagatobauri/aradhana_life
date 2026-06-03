'use client'

import { useChatStore } from '@/store/chatStore'
import { motion } from 'framer-motion'

export default function ApiDashboard() {
  const tokensUsed = useChatStore((state) => state.tokensUsed)
  
  // Hardcoded for demo aesthetics (mimicking the Groq free tier limit of 100k)
  const dailyLimit = 100000 
  const displayTokens = 4250 + tokensUsed // Start at 4250 so it doesn't look empty immediately
  const progressPercent = Math.min((displayTokens / dailyLimit) * 100, 100)

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Logo Placement */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-12 h-12 flex items-center justify-center p-1">
          <img src="/logo.png" alt="Aradhana Life" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-serif text-xl text-brand-navy leading-tight">Aradhana</h1>
          <p className="text-[9px] uppercase tracking-[0.2em] text-brand-orange">AI Astrologer</p>
        </div>
      </div>

      {/* Dashboard Card */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-navy">API Quota</h3>
            <span className="text-[9px] font-mono bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded uppercase tracking-wider">Demo Mode</span>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>

        {/* Circular/Linear Gauge */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Tokens Used</span>
            <span className="font-mono text-brand-navy">{displayTokens.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-orange"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>0</span>
            <span>{dailyLimit.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500">Model</span>
            <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-brand-navy">llama-3.3-70b</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-500">Latency</span>
            <span className="text-[10px] font-mono text-green-600">~650ms</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
