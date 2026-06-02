'use client'
import { useState } from 'react'
import { useChatStore } from '@/store/chatStore'
import MessageBubble from './MessageBubble'
import ToolActivity from './ToolActivity'

export default function ChatWindow() {
  const [input, setInput] = useState('')
  const { sessionId, birthDetails, messages, addMessage, updateLastAIMessage, setActiveTool, setIsTyping, isTyping } = useChatStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    
    const userMessage = input.trim()
    setInput('')
    addMessage({ id: Date.now().toString(), role: 'user', content: userMessage })
    addMessage({ id: (Date.now()+1).toString(), role: 'ai', content: '' }) // Placeholder for streaming
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
          birth_details: birthDetails
        })
      });

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
              } else if (data.type === 'tool_end') {
                setActiveTool(null);
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
    } finally {
      setIsTyping(false);
      setActiveTool(null);
    }
  }

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        <ToolActivity />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask AstroAgent..."
          className="flex-1 p-2 border rounded text-black"
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  )
}
