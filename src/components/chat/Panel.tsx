import type { FC, FormEvent, RefObject } from 'react'
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
  DefaultQuestions
} from './style'



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

  return (
    <ChatPanelWrapper>
      <MessageList ref={messageListRef}>
        {messages.length === 0 ? (
          <EmptyState>
            Hello, I'm Renan Bardy<small>You can ask me anything about my professional career, projects, skills or context.</small>
          </EmptyState>
        ) : null}

        {messages.map((message) => (
          <MessageCard key={message.id} $role={message.role}>
            {message.content || '...'}
            {message.sources && message.sources.length > 0 ? (
              <MessageMeta>
                Fontes: {Array.from(new Set(message.sources)).join(', ')}
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
            <div key={question} className="item" onClick={() => onInputChange(question)}>
              {question}
            </div>
          ))}
        </DefaultQuestions>
        <TextArea onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit(e)
          }
        }} value={input} onChange={(event) => onInputChange(event.target.value)} placeholder="Ask me anything about my professional career, projects, skills or context." disabled={isSending} />
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
