import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
 // No need for styled-component theme
 :root {
  --background-color: #f6f6f0;
 }
  
 html,
 body {
   padding: 0;
   margin: 0;
   font-family: 'Playfair Display', serif;
   background-color:  var(--background-color);
 }

 a {
   color: inherit;
   text-decoration: none;
 }

 * {
   box-sizing: border-box;
 }
`