import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm'
import { RE_SYSTEM_PROMPT, formatRetrievedContext } from '@/services/llm/persona'
import type { ChatHistoryEntry } from './types'

export const createSystemMessage = ({
  retrievedContext,
  contextLabel,
}: {
  retrievedContext: string[]
  contextLabel: string
}) => ({
  role: 'system' as const,
  content: `${RE_SYSTEM_PROMPT}\n\n${contextLabel}:\n\n${formatRetrievedContext(retrievedContext)}`,
})

export const createHistoryMessages = (
  history: ChatHistoryEntry[]
): ChatCompletionMessageParam[] => {
  return history.map((message) => ({
    role: message.role,
    content: message.content,
  }))
}

export const createChatMessages = ({
  question,
  retrievedContext,
  contextLabel,
  history,
}: {
  question: string
  retrievedContext: string[]
  contextLabel: string
  history: ChatHistoryEntry[]
}): ChatCompletionMessageParam[] => {
  return [
    createSystemMessage({ retrievedContext, contextLabel }),
    ...createHistoryMessages(history),
    { role: 'user', content: question },
  ]
}
