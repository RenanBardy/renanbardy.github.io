import constants from '@/config/constants'
import { buildContextBlocks, rankChunks } from './rank'
import type { RagIndex, SearchOptions } from './types'
import { createQueryEmbedding } from './queryEmbedding'

export const searchRagIndex = async ({
  index,
  query,
  options = {},
}: {
  index: RagIndex
  query: string
  options?: SearchOptions
}) => {
  const queryVector = await createQueryEmbedding(query)
  const results = rankChunks({
    chunks: index.chunks,
    queryVector,
    chunkVectors: index.vectors,
    topK: options.topK ?? constants.RAG_SEARCH_DEFAULTS.topK,
    priorityWeight:
      options.priorityWeight ?? constants.RAG_SEARCH_DEFAULTS.priorityWeight,
    minimumScore:
      options.minimumScore ?? constants.RAG_SEARCH_DEFAULTS.minimumScore,
  })

  const contextBlocks = buildContextBlocks(
    results,
    options.maxContextCharacters ??
      constants.RAG_SEARCH_DEFAULTS.maxContextCharacters
  )

  return {
    results,
    contextBlocks,
  }
}
