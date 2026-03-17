import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
 :root {
  --background-color: #212121;
  --background-color-secondary: rgba(50, 50, 50, 0.85);
  --color-text-primary: #ffffff;
  --color-text-secondary: #8e8e9f;
  --font-family: 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', serif;
  --border-radius: 8px;
 }

 html,
 body {
   padding: 0;
   margin: 0;
   height: 100vh;
   overflow: hidden;
   font-family: var(--font-family);
   background-color: var(--background-color);
   color: var(--color-text-primary);
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
