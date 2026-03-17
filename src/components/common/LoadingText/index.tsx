import type { FC } from "react"
import styled from "styled-components"

export const LoadingText: FC = () => {
  return (
    <LoadingTextWrapper>
      <LoadingTextDot $delay="0s" />
      <LoadingTextDot $delay="0.2s" />
      <LoadingTextDot $delay="0.4s" />
    </LoadingTextWrapper>
  )
}

const LoadingTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`

const LoadingTextDot = styled.div<{ $delay: string }>`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: currentColor;
  animation: loading 0.8s ${({ $delay }) => $delay} infinite ease-in-out;
  @keyframes loading {
    0%, 100% {
      top: 0;
    }
    50% {
      top: -6px;
    }
  }
`
