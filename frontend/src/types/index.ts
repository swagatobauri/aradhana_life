// Shared TypeScript types for AstroAgent frontend

export interface BirthDetails {
  date: string;       // ISO date string, e.g. "1990-06-15"
  time: string;       // 24-hour time string, e.g. "14:30"
  place: string;      // Free-text place name
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  toolActivity?: ToolActivity[];
  isStreaming?: boolean;
}

export interface ToolActivity {
  toolName: string;
  status: "running" | "completed" | "error";
  result?: string;
}

export interface ChatSession {
  sessionId: string;
  birthDetails: BirthDetails | null;
  messages: Message[];
}

export interface StreamEvent {
  type: "token" | "tool_start" | "tool_end" | "error" | "done";
  data: string;
  toolName?: string;
}

export interface ApiError {
  detail: string;
  code?: string;
}
