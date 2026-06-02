'use client'

import { useChatStore } from '@/store/chatStore';

export default function ToolActivity() {
  const activeTool = useChatStore((state) => state.activeTool);

  if (!activeTool) return null;

  const getToolMessage = (tool: string) => {
    switch(tool) {
      case 'geocode_place': return "✨ Resolving location coordinates...";
      case 'compute_birth_chart': return "✨ Aligning the stars and computing chart...";
      case 'get_daily_transits': return "✨ Reading current planetary transits...";
      case 'knowledge_lookup': return "✨ Consulting ancient knowledge texts...";
      default: return `✨ Using tool: ${tool}...`;
    }
  }

  return (
    <div className="flex justify-start my-2">
      <div className="p-2 text-sm bg-purple-100 text-purple-800 rounded-full animate-pulse">
        {getToolMessage(activeTool)}
      </div>
    </div>
  );
}
