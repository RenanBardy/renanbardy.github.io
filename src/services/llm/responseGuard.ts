const UNSUPPORTED_RESPONSE =
  'I do not have that information in the provided context.'

const OUT_OF_SCOPE_RESPONSE =
  'I can only answer based on my professional context.'

const normalizeText = (value: string) =>
  value.replace(/\s+/g, ' ').trim()

const startsWithExactFallback = (text: string, fallback: string) => {
  const normalizedText = normalizeText(text)
  const normalizedFallback = normalizeText(fallback)

  return (
    normalizedText === normalizedFallback ||
    normalizedText.startsWith(`${normalizedFallback} `)
  )
}

export const guardResponse = (value: string) => {
  if (startsWithExactFallback(value, UNSUPPORTED_RESPONSE)) {
    return UNSUPPORTED_RESPONSE
  }

  if (startsWithExactFallback(value, OUT_OF_SCOPE_RESPONSE)) {
    return OUT_OF_SCOPE_RESPONSE
  }

  return value.trim()
}
