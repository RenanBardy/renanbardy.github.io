import styled from 'styled-components'


export const ChatPanelWrapper = styled.section`
  display: grid;
  gap: 16px;
  padding: 12px;
  padding-top: 48px;
  height: 100%;
  width: 100%;
`

export const MessageList = styled.div`
  gap: 8px;
  height: 100%;
  overflow: auto;
  padding-right: 4px;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  font-size: clamp(2rem, 3vw, 3.4rem);
  small {
    opacity: 0.6;
    font-size: 1.8rem;
  }
`

export const MessageCard = styled.article<{ $role: 'user' | 'assistant' }>`
  display: flex;
  flex-direction: column;
  justify-self: ${({ $role }) => ($role === 'user' ? 'end' : 'start')};
  max-width: 100%;
  padding: ${({ $role }) => ($role === 'user' ? '12px 22px' : '0')};
  border-radius: calc(var(--border-radius) * 4);
  height: auto;
  align-self: start;
  background: ${({ $role }) =>
    $role === 'user' ? 'var(--background-color-secondary)' : 'transparent'};
  color: ${({ $role }) => ($role === 'user' ? 'var(--color-text-primary)' : 'var(--color-text-primary)')};
  white-space: pre-wrap;
  line-height: 1.55;
`

export const MessageMeta = styled.div`
  margin-top: 6px;
  font-size: 0.82rem;
  opacity: 0.8;
`

export const Composer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: end;
  padding-bottom: 36px;
  width: 100%;
  overflow: hidden;
`

export const TextArea = styled.textarea`
  resize: none;
  height: 100px;
  width: 100%;
  border-radius: calc(var(--border-radius) * 4);
  background: var(--background-color-secondary);
  border: none;
  padding: 12px 22px;
  color: var(--color-text-primary);
  &:focus {
    outline: none;
  }
`

export const Actions = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
  flex-wrap: wrap;
`

export const Hint = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
`

export const DefaultQuestions = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  height: 32px;
  align-items: center;
  opacity: 0.2;
  transition: all 0.4s ease;
  width: 100%;
  &:hover {
    opacity: 1;
  }
  .title {
    font-size: 12px;
    color: var(--color-text-secondary);
  }
  .item {
    font-size: 12px;
    padding: 8px 16px;
    min-width: 130px;
    height: 32px;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: calc(var(--border-radius) * 4);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    border: 1px solid var(--color-text-secondary);
    transition: all 0.2s ease;
    &:hover {
      background: var(--background-color-secondary);
      color: var(--color-text-primary);
    }
  }
`