import { useEffect, useRef, useState, type FC, type FormEvent } from 'react'
import { Layout } from '@/components/Layout'
import { ChatPanel } from '@/components/chat/Panel'
import { chatService, type ChatHistoryEntry } from '@/services/llm'
import type { ChatMessage } from '@/types/chat'

const formatProgress = (label: string | undefined) =>
  label ? label.replace(/\s+/g, ' ').trim() : 'carregando'

const createMessage = (
  role: 'user' | 'assistant',
  content: string,
  sources?: string[]
): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString(),
  sources,
})

export const Chat: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [chatStatus, setChatStatus] = useState('inicializando')
  const [chatError, setChatError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const messageListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    void chatService
      .loadChatModel((report) => {
        setChatStatus(formatProgress(report.text))
      })
      .then(() => {
        setChatStatus('ready')
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        setChatError(message)
        setChatStatus('error')
      })
  }, [])

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const question = input.trim()
    if (!question || isSending) {
      return
    }

    setInput('')
    setIsSending(true)
    setChatError(null)

    const userMessage = createMessage('user', question)
    setMessages((current) => [...current, userMessage])

    const assistantId = crypto.randomUUID()
    setMessages((current) => [
      ...current,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      },
    ])

    try {
      const history: ChatHistoryEntry[] = messages.map((message) => ({
        role: message.role,
        content: message.content,
      }))

      const response = await chatService.sendMessage({
        question,
        history,
        onToken: (partial, sources) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, content: partial, sources }
                : message
            )
          )
        },
      })

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: response.content,
                sources: response.sources,
              }
            : message
        )
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setChatError(message)
      setMessages((current) =>
        current.map((entry) =>
          entry.id === assistantId
            ? {
                ...entry,
                content:
                  'Não consegui concluir a resposta porque houve uma falha ao carregar o modelo ou a base local.',
              }
            : entry
        )
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleReset = async () => {
    setMessages([])
    setChatError(null)
    await chatService.resetConversation()
  }

  return (
    <Layout title="Renan Bardy">
      <ChatPanel
        messages={messages}
        input={input}
        isSending={isSending}
        chatStatus={chatStatus}
        chatError={chatError}
        messageListRef={messageListRef}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onReset={() => {
          void handleReset()
        }}
      />
    </Layout>
  )
}
