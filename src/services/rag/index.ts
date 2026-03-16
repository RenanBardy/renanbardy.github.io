import { createRagIndex } from './load'
import { createQueryEmbedding } from './queryEmbedding'
import { searchRagIndex } from './search'
import type { RagIndex, RagService } from './types'

const createRagService = (): RagService => {
  let indexPromise: Promise<RagIndex> | null = null

  const loadRagIndex = async () => {
    if (!indexPromise) {
      indexPromise = createRagIndex()
    }

    return indexPromise
  }

  return {
    loadRagIndex,
    embedQuery: createQueryEmbedding,
    async search(query, options = {}) {
      const index = await loadRagIndex()
      return searchRagIndex({
        index,
        query,
        options,
      })
    },
  }
}

export const ragService = createRagService()

export type { SearchOptions, RagSearchResult } from './types'
