import styled, { css } from 'styled-components'

const secondaryStyles = css`
  background: transparent;
  color: var(--color-text-secondary);
  border-color: rgba(31, 41, 55, 0.2);
`

export const StyledButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  appearance: none;
  border: 1px solid transparent;
  border-radius: calc(var(--border-radius) * 4);
  padding: 12px 22px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 140ms ease,
    opacity 140ms ease,
    background-color 140ms ease;
  background: var(--background-color-secondary);
  color: #f8fafc;

  ${({ $variant }) => ($variant === 'secondary' ? secondaryStyles : '')}

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    opacity: 0.96;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`
