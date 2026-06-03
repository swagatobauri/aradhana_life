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
  chartData: any | null;
  isGeneratingChart: boolean;
  hasInitialChart: boolean;
  tokensUsed: number;
  setBirthDetails: (details: BirthDetails | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (msg: Message) => void;
  updateLastAIMessage: (content: string) => void;
  clearLastAIMessage: () => void;
  removeLastMessage: () => void;
  setActiveTool: (tool: string | null) => void;
  setIsTyping: (status: boolean) => void;
  setChartData: (data: any) => void;
  setIsGeneratingChart: (status: boolean) => void;
  setHasInitialChart: (status: boolean) => void;
  addTokens: (amount: number) => void;
  resetSession: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionId: Math.random().toString(36).substring(7), // Simple random session ID
      birthDetails: null,
      messages: [],
      activeTool: null,
      isTyping: false,
      chartData: null,
      isGeneratingChart: false,
      hasInitialChart: false,
      tokensUsed: 0,
      setBirthDetails: (details) => set({ birthDetails: details }),
      setMessages: (messages) => set({ messages }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      updateLastAIMessage: (content) => set((state) => {
        const newMessages = [...state.messages];
        const lastIdx = newMessages.length - 1;
        if (lastIdx >= 0 && newMessages[lastIdx].role === 'ai') {
          newMessages[lastIdx].content += content;
        }
        return { messages: newMessages };
      }),
      clearLastAIMessage: () => set((state) => {
        const newMessages = [...state.messages];
        const lastIdx = newMessages.length - 1;
        if (lastIdx >= 0 && newMessages[lastIdx].role === 'ai') {
          newMessages[lastIdx].content = '';
        }
        return { messages: newMessages };
      }),
      removeLastMessage: () => set((state) => {
        return { messages: state.messages.slice(0, -1) };
      }),
      setActiveTool: (tool) => set({ activeTool: tool }),
      setIsTyping: (status) => set({ isTyping: status }),
      setChartData: (data) => set({ chartData: data }),
      setIsGeneratingChart: (status) => set({ isGeneratingChart: status }),
      setHasInitialChart: (status) => set({ hasInitialChart: status }),
      addTokens: (amount) => set((state) => ({ tokensUsed: state.tokensUsed + amount })),
      resetSession: () => set({
        sessionId: Math.random().toString(36).substring(7),
        messages: [],
        chartData: null,
        hasInitialChart: false,
        isGeneratingChart: true,
        tokensUsed: 0
      })
    }),
    {
      name: 'astro-agent-storage',
      partialize: (state) => ({ 
        sessionId: state.sessionId, 
        birthDetails: state.birthDetails, 
        messages: state.messages,
        chartData: state.chartData,
        hasInitialChart: state.hasInitialChart
      }), // Persist session, details, chart, and chat history
    }
  )
)
