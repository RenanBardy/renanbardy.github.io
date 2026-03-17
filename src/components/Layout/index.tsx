import type { FC, PropsWithChildren } from 'react'
import {
  LayoutShell,
  Page,
  Header,
} from './style'
import GithubIcon from './github.svg?react'
import LinkedinIcon from './linkedin.svg?react'
import EmailIcon from './mail.svg?react'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Page>
      <Header>
        <a href="https://github.com/RenanBardy/renanbardy.github.io" target="_blank" rel="noopener noreferrer"><GithubIcon /></a>
        <a href="https://www.linkedin.com/in/renan-bardy-33874692/" target="_blank" rel="noopener noreferrer"><LinkedinIcon /></a>
        <a href="mailto:renan.bardy@gmail.com" target="_blank" rel="noopener noreferrer"><EmailIcon /></a>
      </Header>
      <LayoutShell>
        {children}
      </LayoutShell>
    </Page>
  )
}
