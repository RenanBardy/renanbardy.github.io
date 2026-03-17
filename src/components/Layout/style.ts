import styled from 'styled-components'

export const Page = styled.main`
  height: 100vh;
`

export const LayoutShell = styled.div`
  max-width: 920px;
  height: calc(100vh - 48px);
  margin: 0 auto;
`

export const Header = styled.div`
  width: max-content;
  background: #000;
  align-self: center;
  justify-self: center;
  margin-top: 16px;
  padding: 8px 16px;
  border-radius: calc(var(--border-radius) * 4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0.2;
  transition: opacity 0.4s ease;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  a {
    color: var(--color-text-secondary);
    transition: color 0.4s ease;
    display: flex;
    align-items: center;
    width: 16px;
    height: 16px;
    svg {
      height: 100%;
      width: 100%;
    }
    &:hover {
      color: var(--color-text-primary);
    }
  }
`

