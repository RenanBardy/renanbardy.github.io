import { useRef, type FC, type FormEvent, type RefObject } from 'react'
import { Button } from '@/components/common/Button'
import type { ChatMessage } from '@/types/chat'
import {
  Hint,
  ChatPanelWrapper,
  MessageList,
  EmptyState,
  MessageCard,
  MessageMeta,
  Composer,
  TextArea,
  Actions,
  DefaultQuestions,
} from './style'
import { LoadingText } from '@/components/common/LoadingText'

const placeholder = "Ask me anything about my professional career, projects, skills."

export const ChatPanel: FC<{
  defaultQuestions: string[]
  messages: ChatMessage[]
  input: string
  isSending: boolean
  chatStatus: string
  chatError: string | null
  messageListRef: RefObject<HTMLDivElement | null>
  onInputChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
  onReset: () => void
}> = ({
  defaultQuestions,
  messages,
  input,
  isSending,
  chatStatus,
  chatError,
  messageListRef,
  onInputChange,
  onSubmit,
  onReset,
}) => {
  const isDisabled = Boolean(isSending || input.trim() === '' || chatError)
  const isLoading = chatStatus !== 'ready'
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <ChatPanelWrapper>
      <MessageList ref={messageListRef}>
        {messages.length === 0 ? (
          <EmptyState>
            Hello, I'm Renan Bardy<small>{placeholder}</small>
          </EmptyState>
        ) : null}

        {messages.map((message) => (
          <MessageCard key={message.id} $role={message.role}>
            {message.content || <LoadingText />}
            {message.sources && message.sources.length > 0 ? (
              <MessageMeta>
                Sources: {Array.from(new Set(message.sources)).join(', ')}
              </MessageMeta>
            ) : null}
          </MessageCard>
        ))}
      </MessageList>
      <Composer onSubmit={onSubmit}>
        {(chatStatus && chatStatus !== 'ready') ? <Hint>{chatStatus}</Hint> : null}
        <DefaultQuestions>
          <div className="title">Suggestions:</div>
          {defaultQuestions.map((question) => (
            <div key={question} className="item" onClick={() => {
              onInputChange(question);
              textAreaRef.current?.focus()
            }}>
              {question}
            </div>
          ))}
        </DefaultQuestions>
        <TextArea
        ref={textAreaRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit(e)
          }
        }} value={input} onChange={(event) => onInputChange(event.target.value)} placeholder={placeholder} disabled={isSending} />
        <Actions>
          <div>
            <Button type="button" variant="secondary" onClick={onReset}>
              Clear conversation
            </Button>{' '}
            <Button type="submit" disabled={isDisabled || isLoading}>
              {isLoading ? `Loading...` : 'Send question'}
            </Button>
          </div>
        </Actions>
      </Composer>
    </ChatPanelWrapper>
  )
}
