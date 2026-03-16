import type { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'
import { StyledButton } from './style'

interface ButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: 'primary' | 'secondary'
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  ...props
}) => {
  return (
    <StyledButton {...props} $variant={variant}>
      {children}
    </StyledButton>
  )
}
