import {
  type ChatCompletionChunk,
} from '@mlc-ai/web-llm'
import { createEngineLoader } from './engineLoader'
import { createContextProvider } from './contextProvider'
import { createChatMessages } from './messageFactory'
import { consumeChatStream } from './stream'
import type { ChatService } from './types'

const createChatService = (): ChatService => {
  const { loadChatModel: loadEngineModel, getLoadedEngine } = createEngineLoader()
  const contextProvider = createContextProvider()

  return {
    async loadChatModel(onProgress) {
      await loadEngineModel(onProgress)
    },

    async sendMessage({ question, history, contextMode, onToken }) {
      await loadEngineModel()
      const engine = await getLoadedEngine()
      const { contextBlocks, sources, contextLabel } = await contextProvider.load(
        contextMode,
        question
      )
      const messages = createChatMessages({
        question,
        retrievedContext: contextBlocks,
        contextLabel,
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
export type { ChatHistoryEntry, ChatContextMode } from './types'
