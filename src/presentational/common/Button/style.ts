import styled, { css } from 'styled-components'

const secondaryStyles = css`
  background: transparent;
  color: #1f2937;
  border-color: rgba(31, 41, 55, 0.2);
`

export const StyledButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 140ms ease,
    opacity 140ms ease,
    background-color 140ms ease;
  background: #0f766e;
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
