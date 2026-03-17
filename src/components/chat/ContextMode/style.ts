import styled from 'styled-components'

export const ContextModeSwitch = styled.div`
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 20;
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: var(--background-color-secondary);
  border: 1px solid var(--color-text-secondary);
  backdrop-filter: blur(10px);

  button {
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  button[data-active='true'] {
    background: var(--background-color);
    color: #f8fafc;
  }
`
