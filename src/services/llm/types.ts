import type { InitProgressReport } from '@mlc-ai/web-llm'

export interface ChatHistoryEntry {
  role: 'user' | 'assistant'
  content: string
}

export type ChatContextMode = 'rag' | 'context'

export interface SendMessageInput {
  question: string
  history: ChatHistoryEntry[]
  contextMode: ChatContextMode
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
