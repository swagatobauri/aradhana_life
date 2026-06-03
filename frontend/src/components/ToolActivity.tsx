'use client'

import { useChatStore } from '@/store/chatStore';

export default function ToolActivity() {
  const activeTool = useChatStore((state) => state.activeTool);

  if (!activeTool) return null;

  const getToolMessage = (tool: string) => {
    switch(tool) {
      case 'geocode_place': return "Resolving coordinates · geopy";
      case 'compute_birth_chart': return "Computing birth chart · flatlib";
      case 'get_daily_transits': return "Fetching today's transits · flatlib";
      case 'knowledge_lookup': return "Querying ancient texts · chromadb";
      default: return `Using tool · ${tool}`;
    }
  }

  return (
    <div className="flex justify-start my-4">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
        <div className="w-2.5 h-2.5 border-[1.5px] border-brand-purple border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
          {getToolMessage(activeTool)}
        </span>
      </div>
    </div>
  );
}
