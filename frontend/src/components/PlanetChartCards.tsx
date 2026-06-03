'use client'

import { useChatStore } from '@/store/chatStore';

const GLYPHS: Record<string, string> = {
  'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 
  'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 
  'Neptune': '♆', 'Pluto': '♇', 'North Node': '☊', 'South Node': '☋'
};

export default function PlanetChartCards() {
  const chartData = useChatStore((state) => state.chartData);

  if (!chartData || !chartData.planets) return null;

  return (
    <div className="w-full max-w-[85%] mb-8">
      <h3 className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-3">Your Natal Alignments</h3>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(chartData.planets).map(([planet, details]: [string, any]) => (
          <div key={planet} className="p-3 bg-white border border-gray-200 rounded-sm flex flex-col items-center justify-center text-center">
            <span className="text-xl text-brand-gold font-medium mb-1">{GLYPHS[planet] || '✨'}</span>
            <span className="text-[10px] font-semibold text-brand-navy uppercase tracking-wider">{details.sign}</span>
            <span className="text-[9px] text-gray-400">{details.degree}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
