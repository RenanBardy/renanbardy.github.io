const EMBEDDING_DIMENSIONS = 256

const tokenize = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{Letter}\p{Number}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1)
}

const hashToken = (token: string) => {
  let hash = 0
  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) >>> 0
  }
  return hash
}

export const embedText = (value: string) => {
  const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0)

  for (const token of tokenize(value)) {
    const hash = hashToken(token)
    const slot = hash % EMBEDDING_DIMENSIONS
    const sign = hash % 2 === 0 ? 1 : -1
    vector[slot] += sign
  }

  const magnitude = Math.sqrt(
    vector.reduce((sum, item) => sum + item * item, 0)
  )

  if (magnitude === 0) {
    return vector
  }

  return vector.map((item) => Number((item / magnitude).toFixed(8)))
}

export const getEmbeddingDimensions = () => EMBEDDING_DIMENSIONS
