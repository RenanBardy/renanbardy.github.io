import type { FC } from 'react'
import { ContextModeSwitch } from './style'
import type { ChatContextMode } from '@/services/llm/types'

export const ContextMode: FC<{
  contextMode: ChatContextMode
  onContextModeChange: (mode: ChatContextMode) => void
}> = ({ contextMode, onContextModeChange }) => {
  return (
    <ContextModeSwitch>
      <button
        type="button"
        aria-pressed={contextMode === 'context'}
        data-active={contextMode === 'context'}
        onClick={() => onContextModeChange('context')}
      >
        Context
      </button>
      <button
        type="button"
        aria-pressed={contextMode === 'rag'}
        data-active={contextMode === 'rag'}
        onClick={() => onContextModeChange('rag')}
      >
        RAG
      </button>
    </ContextModeSwitch>
    )
}