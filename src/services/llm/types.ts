import type { InitProgressReport } from '@mlc-ai/web-llm'

export interface ChatHistoryEntry {
  role: 'user' | 'assistant'
  content: string
}

export interface SendMessageInput {
  question: string
  history: ChatHistoryEntry[]
  onToken?: (partial: string, sources: string[]) => void
}

export interface SendMessageResult {
  content: string
  sources: string[]
}

export interface ChatService {
  loadChatModel(onProgress?: (report: InitProgressReport) => void): Promise<void>
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>
  resetConversation(): Promise<void>
}
