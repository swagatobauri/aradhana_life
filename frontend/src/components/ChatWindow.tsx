'use client'
import { useState, useEffect, useRef } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import MessageBubble from './MessageBubble'
import ToolActivity from './ToolActivity'
import VedicChart from './VedicChart'

export default function ChatWindow() {
  const [input, setInput] = useState('')
  const { sessionId, birthDetails, messages, addMessage, updateLastAIMessage, clearLastAIMessage, removeLastMessage, setActiveTool, setIsTyping, isTyping, setChartData, isGeneratingChart, hasInitialChart, setHasInitialChart, setIsGeneratingChart } = useChatStore()
  const { userId } = useAuthStore()

  const initialFetchTriggered = useRef(false);

  // Automatically trigger the initial chart generation
  useEffect(() => {
    if (isGeneratingChart && !hasInitialChart && birthDetails && !initialFetchTriggered.current) {
      initialFetchTriggered.current = true;
      setHasInitialChart(true);
      const initialMessage = "Compute my birth chart based on my details and provide an initial spiritual reading.";
      submitMessage(initialMessage, true);
    }
  }, [isGeneratingChart, hasInitialChart, birthDetails]);

  const submitMessage = async (userMessage: string, hidden: boolean = false) => {
    if (isTyping) return;
    
    if (!hidden) {
      addMessage({ id: `user-${Date.now()}-${Math.random()}`, role: 'user', content: userMessage })
    }
    addMessage({ id: `ai-${Date.now()}-${Math.random()}`, role: 'ai', content: '' }) // Placeholder for streaming
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_id: userId || sessionId,
          birth_details: birthDetails
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'tool_start') {
                setActiveTool(data.tool);
                clearLastAIMessage(); // Wipe the hallucinated pre-amble so the final response starts fresh
              } else if (data.type === 'tool_end') {
                setActiveTool(null);
                if (data.tool === 'compute_birth_chart' && data.output) {
                  try {
                    const parsed = JSON.parse(data.output);
                    setChartData(parsed);
                  } catch(e) {}
                }
              } else if (data.type === 'content') {
                updateLastAIMessage(data.content);
              } else if (data.type === 'error') {
                console.error("Agent error:", data.content);
              }
            } catch (e) {
              console.error("Error parsing SSE:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setIsGeneratingChart(false);
    } finally {
      setIsTyping(false);
      setActiveTool(null);
      
      // Safety net: if the backend completely failed to stream anything, replace the stuck bouncing dots with a fallback message
      const latestMessages = useChatStore.getState().messages;
      if (latestMessages.length > 0 && latestMessages[latestMessages.length - 1].role === 'ai' && latestMessages[latestMessages.length - 1].content === '') {
        removeLastMessage();
        addMessage({ id: `ai-error-${Date.now()}`, role: 'ai', content: "I'm sorry, the stars are cloudy right now and I couldn't connect with the universe. Please try again." });
      }

      // Guaranteed fallback to unstuck the loading screen when the AI finishes its first response
      if (useChatStore.getState().isGeneratingChart) {
        setTimeout(() => {
          useChatStore.getState().setIsGeneratingChart(false);
        }, 2000);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    const userMessage = input.trim()
    setInput('')
    submitMessage(userMessage);
  }

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-3xl mx-auto bg-brand-bg overflow-hidden border border-gray-200 shadow-sm rounded-sm">
      <div className="flex-1 overflow-y-auto p-6 bg-brand-bg">
        <VedicChart />
        {messages.map((m, index) => {
          // Hide old 'ghost' messages that got stuck empty in local storage from previous errors
          if (m.role === 'ai' && m.content === '' && (!isTyping || index !== messages.length - 1)) {
            return null;
          }
          return <MessageBubble key={m.id} role={m.role} content={m.content} />
        })}
        <ToolActivity />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 flex gap-4 items-center">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask the stars about your path..."
          className="flex-1 p-3 bg-gray-50 border border-gray-200 text-brand-navy placeholder-gray-400 focus:outline-none focus:border-brand-purple transition-colors text-sm rounded-sm"
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping} className="px-6 py-3 bg-brand-navy text-brand-lavender text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 rounded-sm font-medium">
          Send
        </button>
      </form>
    </div>
  )
}
