import {
  type ChatCompletionChunk,
} from '@mlc-ai/web-llm'
import { ragService } from '@/services/rag'
import { createEngineLoader } from './engineLoader'
import { createChatMessages } from './messageFactory'
import { consumeChatStream } from './stream'
import type { ChatService } from './types'

const createChatService = (): ChatService => {
  const { loadChatModel: loadEngineModel, getLoadedEngine } = createEngineLoader()

  return {
    async loadChatModel(onProgress) {
      await ragService.loadRagIndex()
      await loadEngineModel(onProgress)
    },

    async sendMessage({ question, history, onToken }) {
      await loadEngineModel()
      const engine = await getLoadedEngine()
      const { results, contextBlocks } = await ragService.search(question)
      const sources = results.map((result) => result.chunk.source)
      const messages = createChatMessages({
        question,
        retrievedContext: contextBlocks,
        history,
      })

      const stream = (await engine.chat.completions.create({
        messages,
        stream: true,
        temperature: 0.2,
        top_p: 0.9,
      })) as AsyncIterable<ChatCompletionChunk>

      return consumeChatStream({
        stream,
        onToken,
        sources,
      }).then((content) => ({
        content,
        sources,
      }))
    },

    async resetConversation() {
      const engine = await getLoadedEngine()
      await engine.resetChat()
    },
  }
}

export const chatService = createChatService()
export type { ChatHistoryEntry } from './types'
