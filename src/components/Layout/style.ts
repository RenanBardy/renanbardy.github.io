import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px 20px 48px;
  background:
    radial-gradient(circle at top left, rgba(217, 119, 6, 0.16), transparent 30%),
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.16), transparent 28%),
    linear-gradient(180deg, #f8f4ec 0%, #f1ece3 100%);
  color: #1f2937;
`

export const LayoutShell = styled.div`
  max-width: 920px;
  margin: 0 auto;
`

export const Hero = styled.header`
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
`

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 3vw, 3.4rem);
  font-family: 'Playfair Display', serif;
`
