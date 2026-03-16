import type { ChatCompletionChunk } from '@mlc-ai/web-llm'

export const consumeChatStream = async ({
  stream,
  onToken,
  sources,
}: {
  stream: AsyncIterable<ChatCompletionChunk>
  onToken?: (partial: string, sources: string[]) => void
  sources: string[]
}) => {
  let finalText = ''

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta.content ?? ''
    if (!delta) {
      continue
    }

    finalText += delta
    onToken?.(finalText, sources)
  }

  return finalText.trim()
}
