'use client'

import React from 'react'
import { useChatStore } from '@/store/chatStore'

const ZODIAC_NUMBERS: Record<string, number> = {
  'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4,
  'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8,
  'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
}

const PLANET_ABBREVIATIONS: Record<string, string> = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
  'Jupiter': 'Gu', 'Venus': 'Ve', 'Saturn': 'Sa',
  'North Node': 'Ra', 'South Node': 'Ke'
}

export default function VedicChart() {
  const chartData = useChatStore((state) => state.chartData)

  if (!chartData || !chartData.ascendant || !chartData.planets) return null

  const ascSignName = chartData.ascendant.sign
  const ascNumber = ZODIAC_NUMBERS[ascSignName] || 1

  // Compute which sign number goes into which house (1-12)
  // House 1 is always the ascendant's sign.
  const houses: { house: number, signNumber: number, planets: string[] }[] = []
  for (let i = 1; i <= 12; i++) {
    let signNum = ascNumber + (i - 1)
    if (signNum > 12) signNum -= 12
    houses.push({ house: i, signNumber: signNum, planets: [] })
  }

  // Map planets into houses
  Object.entries(chartData.planets).forEach(([planet, details]: [string, any]) => {
    const abbrev = PLANET_ABBREVIATIONS[planet]
    if (abbrev) {
      const planetSignNum = ZODIAC_NUMBERS[details.sign]
      const houseEntry = houses.find(h => h.signNumber === planetSignNum)
      if (houseEntry) {
        houseEntry.planets.push(abbrev)
      }
    }
  })

  // Centers for the 12 houses (scaled to 400x400 SVG)
  const centers = {
    1: { x: 200, y: 100 },
    2: { x: 95, y: 60 },
    3: { x: 60, y: 95 },
    4: { x: 100, y: 200 },
    5: { x: 60, y: 305 },
    6: { x: 95, y: 340 },
    7: { x: 200, y: 300 },
    8: { x: 305, y: 340 },
    9: { x: 340, y: 305 },
    10: { x: 300, y: 200 },
    11: { x: 340, y: 95 },
    12: { x: 305, y: 60 },
  }
  
  // Placement for zodiac numbers (bottom corners of their respective house area for readability)
  const zNumOffsets = {
    1: { dx: 0, dy: 60 },
    2: { dx: 30, dy: 10 },
    3: { dx: 10, dy: 30 },
    4: { dx: 60, dy: 0 },
    5: { dx: 10, dy: -30 },
    6: { dx: 30, dy: -10 },
    7: { dx: 0, dy: -60 },
    8: { dx: -30, dy: -10 },
    9: { dx: -10, dy: -30 },
    10: { dx: -60, dy: 0 },
    11: { dx: -10, dy: 30 },
    12: { dx: -30, dy: 10 }
  }

  return (
    <div className="w-full flex flex-col items-center mb-8 px-4">
      <h3 className="text-sm uppercase tracking-[0.2em] text-brand-orange font-medium mb-6">Cosmic Blueprint</h3>
      
      <div className="w-full max-w-[400px] aspect-square bg-[#FCF9F2] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-[4px] border-brand-gold rounded-sm p-4 relative">
        <svg viewBox="0 0 400 400" className="w-full h-full text-brand-navy">
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer Square */}
            <rect x="0" y="0" width="400" height="400" fill="none" />
            {/* Diagonals */}
            <line x1="0" y1="0" x2="400" y2="400" />
            <line x1="400" y1="0" x2="0" y2="400" />
            {/* Inner Rhombus / Midpoints */}
            <line x1="200" y1="0" x2="400" y2="200" />
            <line x1="400" y1="200" x2="200" y2="400" />
            <line x1="200" y1="400" x2="0" y2="200" />
            <line x1="0" y1="200" x2="200" y2="0" />
          </g>

          {/* Texts (Planets and Zodiac Numbers) */}
          {houses.map((h) => {
            const center = centers[h.house as keyof typeof centers]
            const offset = zNumOffsets[h.house as keyof typeof zNumOffsets]
            return (
              <g key={h.house}>
                {/* Zodiac Sign Number */}
                <text 
                  x={center.x + offset.dx} 
                  y={center.y + offset.dy} 
                  textAnchor="middle" 
                  alignmentBaseline="middle" 
                  className="text-brand-gold/60 text-lg font-serif font-bold pointer-events-none"
                >
                  {h.signNumber}
                </text>
                
                {/* Planet Abbreviations */}
                <text 
                  x={center.x} 
                  y={center.y} 
                  textAnchor="middle" 
                  alignmentBaseline="middle" 
                  className="fill-brand-navy text-sm font-semibold tracking-wide"
                >
                  {h.planets.map((p, idx) => (
                    <tspan key={p} x={center.x} dy={idx === 0 ? `-${(h.planets.length - 1) * 8}px` : "16px"}>
                      {p}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
