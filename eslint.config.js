const html = require('@html-eslint/eslint-plugin')
const htmlParser = require('@html-eslint/parser')

module.exports = [
  {
    ...html.configs['flat/recommended'],
    rules: {
      ...html.configs['flat/recommended'].rules,
      "@html-eslint/indent": ["error", 2],
    },
    files: ['*.html'],
    plugins: {
      '@html-eslint': html
    },
    languageOptions: {
      parser: htmlParser,
    },
  },
]