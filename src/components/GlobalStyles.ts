import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
 :root {
  --color-text: #1f2937;
  --color-background: #f6f1e8;
  --font-family: 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', serif;
  --border-radius: 8px;
 }

 html,
 body {
   padding: 0;
   margin: 0;
   min-height: 100%;
   font-family: var(--font-family);
   background-color: var(--color-background);
 }

 #root {
   min-height: 100vh;
 }

 a {
   color: inherit;
   text-decoration: none;
 }

 * {
   box-sizing: border-box;
 }

 textarea,
 button,
 input {
   font: inherit;
 }
`
