import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './views/'
import { GlobalStyles } from './views/globalCss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyles />
    <App />
  </StrictMode>
)
