import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BirthDetails {
  date: string;
  time: string;
  place: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

interface ChatState {
  sessionId: string;
  birthDetails: BirthDetails | null;
  messages: Message[];
  activeTool: string | null;
  isTyping: boolean;
  setBirthDetails: (details: BirthDetails) => void;
  addMessage: (msg: Message) => void;
  updateLastAIMessage: (content: string) => void;
  setActiveTool: (tool: string | null) => void;
  setIsTyping: (status: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionId: Math.random().toString(36).substring(7), // Simple random session ID
      birthDetails: null,
      messages: [],
      activeTool: null,
      isTyping: false,
      setBirthDetails: (details) => set({ birthDetails: details }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      updateLastAIMessage: (content) => set((state) => {
        const newMessages = [...state.messages];
        const lastIdx = newMessages.length - 1;
        if (lastIdx >= 0 && newMessages[lastIdx].role === 'ai') {
          newMessages[lastIdx].content += content;
        }
        return { messages: newMessages };
      }),
      setActiveTool: (tool) => set({ activeTool: tool }),
      setIsTyping: (status) => set({ isTyping: status })
    }),
    {
      name: 'astro-agent-storage',
      partialize: (state) => ({ 
        sessionId: state.sessionId, 
        birthDetails: state.birthDetails, 
        messages: state.messages 
      }), // Persist session, details, and chat history
    }
  )
)
