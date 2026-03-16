import type { ChatCompletionMessageParam, MLCEngine } from '@mlc-ai/web-llm'

export const messageExchanger = (engine: MLCEngine) => {
  const history: ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You are a helpful AI assistant.' },
  ]

  return {
    sendMessage: async (message: ChatCompletionMessageParam) => {
      history.push(message)
      const response = await engine.chat.completions.create({ messages: history })
      const reply = response.choices[0].message
      history.push(reply)
      return reply.content
    },
    seeAllMessages: () => {
      return history
    }
  }
}