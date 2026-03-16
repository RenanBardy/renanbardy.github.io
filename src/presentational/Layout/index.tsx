import type { FC, PropsWithChildren } from 'react'
import {
  Hero,
  LayoutShell,
  Page,
  Title,
} from './style'

interface LayoutProps extends PropsWithChildren {
  title: string
}

export const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <Page>
      <LayoutShell>
        <Hero>
          <Title>{title}</Title>
        </Hero>
        {children}
      </LayoutShell>
    </Page>
  )
}
