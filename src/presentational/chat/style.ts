import styled from 'styled-components'


export const ChatPanelWrapper = styled.section`
  display: grid;
  gap: 16px;
  padding: 12px;
  border: 1px solid rgba(31, 41, 55, 0.1);
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.08);
`

export const MessageList = styled.div`
  gap: 8px;
  height: 50vh;
  overflow: auto;
  padding-right: 4px;
`

export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 320px;
  color: #6b7280;
  text-align: center;
`

export const MessageCard = styled.article<{ $role: 'user' | 'assistant' }>`
  display: flex;
  flex-direction: column;
  justify-self: ${({ $role }) => ($role === 'user' ? 'end' : 'start')};
  max-width: min(78ch, 100%);
  padding: 14px 16px;
  border-radius: var(--border-radius);
  height: auto;
  align-self: start;
  background: ${({ $role }) =>
    $role === 'user' ? '#0f766e' : 'rgba(245, 242, 235, 0.96)'};
  color: ${({ $role }) => ($role === 'user' ? '#f8fafc' : '#1f2937')};
  white-space: pre-wrap;
  line-height: 1.55;
`

export const MessageMeta = styled.div`
  margin-top: 6px;
  font-size: 0.82rem;
  opacity: 0.8;
`

export const Composer = styled.form`
  display: grid;
  gap: 12px;
`

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  border: 1px solid rgba(31, 41, 55, 0.14);
  border-radius: var(--border-radius);
  padding: 16px;
  font: inherit;
  color: inherit;
  background: rgba(255, 255, 255, 0.96);
`

export const Actions = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
  flex-wrap: wrap;
`

export const Hint = styled.p`
  margin: 0;
  color: #6b7280;
`
