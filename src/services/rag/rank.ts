import type { RagChunk, RagSearchResult } from './types'

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

const tokenize = (value: string) =>
  normalizeText(value)
    .replace(/[^\p{Letter}\p{Number}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1)

const CURRENT_QUERY_TERMS = new Set([
  'current',
  'currently',
  'now',
  'present',
  'today',
])

const EDUCATION_QUERY_TERMS = new Set([
  'education',
  'educational',
  'study',
  'studies',
  'degree',
  'degrees',
  'university',
  'college',
  'certification',
  'certifications',
  'school',
])

const CURRENT_QUERY_PHRASES = [
  'working on',
  'work on',
  'current role',
  'current project',
  'current projects',
  'right now',
]

const CURRENT_POSITIVE_PATTERNS = [
  /\bcurrent position\b/i,
  /\bi(?:'m| am)? currently working\b/i,
  /\bcurrently working as\b/i,
  /\bcurrent role\b/i,
  /\bpresent\b/i,
]

const CURRENT_NEGATIVE_PATTERNS = [
  /\bnot currently working\b/i,
  /\bsome time ago\b/i,
  /\bpurely for educational purposes\b/i,
]

const HISTORICAL_PATTERNS = [
  /\b201\d\b/,
  /\b202[0-4]\b/,
  /\baug\b/i,
  /\bjan\b/i,
  /\bjun\b/i,
  /\bnov\b/i,
  /\bdez\b/i,
  /\bmarch\b/i,
]

const ENDED_ROLE_PATTERNS = [
  /\b2018\s*-\s*dez 2020\b/i,
  /\b2018\s*-\s*dec 2020\b/i,
  /\bjun 2018\b.*\b2020\b/i,
  /\bnov 2016\b.*\b2018\b/i,
  /\b2014\b/,
  /\b2015\b/,
  /\b2016\b/,
  /\b2017\b/,
  /\b2018\b/,
  /\b2019\b/,
  /\b2020\b/,
]

const hasCurrentIntent = (query: string) => {
  const normalizedQuery = normalizeText(query)
  const queryTokens = tokenize(query)

  return (
    queryTokens.some((token) => CURRENT_QUERY_TERMS.has(token)) ||
    CURRENT_QUERY_PHRASES.some((phrase) => normalizedQuery.includes(phrase))
  )
}

const hasEducationIntent = (query: string) => {
  const queryTokens = tokenize(query)
  return queryTokens.some((token) => EDUCATION_QUERY_TERMS.has(token))
}

const scoreCurrentIntent = (query: string, chunk: RagChunk) => {
  if (!hasCurrentIntent(query)) {
    return 0
  }

  const text = chunk.text
  const normalizedText = normalizeText(text)
  let score = 0

  if (chunk.kind === 'profile') {
    score += 0.16
  }

  if (CURRENT_POSITIVE_PATTERNS.some((pattern) => pattern.test(text))) {
    score += 0.24
  }

  if (normalizedText.includes('working on')) {
    score += 0.08
  }

  if (CURRENT_NEGATIVE_PATTERNS.some((pattern) => pattern.test(text))) {
    score -= 0.32
  }

  if (
    HISTORICAL_PATTERNS.some((pattern) => pattern.test(text)) &&
    !CURRENT_POSITIVE_PATTERNS.some((pattern) => pattern.test(text))
  ) {
    score -= 0.1
  }

  if (ENDED_ROLE_PATTERNS.some((pattern) => pattern.test(text))) {
    score -= 0.2
  }

  return score
}

const scoreKeywordOverlap = (query: string, chunk: RagChunk) => {
  const queryTokens = tokenize(query)

  if (queryTokens.length === 0) {
    return 0
  }

  const searchableText = normalizeText(
    [chunk.title, chunk.tags.join(' '), chunk.text].join(' ')
  )

  let score = 0

  for (const token of queryTokens) {
    if (searchableText.includes(token)) {
      score += 0.08
    }
  }

  return Math.min(score, 0.32)
}

const scoreEducationIntent = (query: string, chunk: RagChunk) => {
  if (!hasEducationIntent(query)) {
    return 0
  }

  const searchableText = normalizeText(
    [chunk.title, chunk.tags.join(' '), chunk.text].join(' ')
  )

  let score = 0

  if (chunk.kind === 'profile') {
    score += 0.18
  }

  if (
    searchableText.includes('education') ||
    searchableText.includes('university') ||
    searchableText.includes('degree') ||
    searchableText.includes('certification')
  ) {
    score += 0.24
  }

  return score
}

const dot = (left: number[], right: number[]) => {
  let sum = 0
  for (let index = 0; index < left.length; index += 1) {
    sum += (left[index] ?? 0) * (right[index] ?? 0)
  }
  return sum
}

const magnitude = (value: number[]) => Math.sqrt(dot(value, value))

export const cosineSimilarity = (left: number[], right: number[]) => {
  if (left.length === 0 || left.length !== right.length) {
    return 0
  }

  const denominator = magnitude(left) * magnitude(right)
  if (denominator === 0) {
    return 0
  }

  return dot(left, right) / denominator
}

export const rankChunks = ({
  chunks,
  query,
  queryVector,
  chunkVectors,
  topK,
  priorityWeight,
  minimumScore,
}: {
  chunks: RagChunk[]
  query: string
  queryVector: number[]
  chunkVectors: Map<string, number[]>
  topK: number
  priorityWeight: number
  minimumScore: number
}): RagSearchResult[] => {
  return chunks
    .map((chunk) => {
      const vector = chunkVectors.get(chunk.id) ?? []
      const similarity = cosineSimilarity(queryVector, vector)
      const weightedScore =
        similarity +
        chunk.priority * priorityWeight +
        scoreCurrentIntent(query, chunk) +
        scoreEducationIntent(query, chunk) +
        scoreKeywordOverlap(query, chunk)

      return {
        chunk,
        score: weightedScore,
      }
    })
    .filter((result) => result.score >= minimumScore)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK)
}

export const buildContextBlocks = (
  results: RagSearchResult[],
  maxCharacters: number
) => {
  const blocks: string[] = []
  let consumed = 0

  for (const result of results) {
    const block = [
      `[${result.chunk.kind}] ${result.chunk.title}`,
      `Tags: ${result.chunk.tags.join(', ')}`,
      result.chunk.text,
    ].join('\n')

    if (consumed + block.length > maxCharacters && blocks.length > 0) {
      break
    }

    blocks.push(block)
    consumed += block.length
  }

  return blocks
}
