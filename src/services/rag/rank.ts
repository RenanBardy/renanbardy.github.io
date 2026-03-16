import type { RagChunk, RagSearchResult } from './types'

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
  queryVector,
  chunkVectors,
  topK,
  priorityWeight,
  minimumScore,
}: {
  chunks: RagChunk[]
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
      const weightedScore = similarity + chunk.priority * priorityWeight

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
