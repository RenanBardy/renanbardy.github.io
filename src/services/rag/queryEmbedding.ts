import constants from '@/config/constants'
import { embedText } from '@/features/rag/embedder'
import { readCache, writeCache } from '@/features/rag/storage'

export const createQueryEmbedding = async (text: string) => {
  const cacheKey = `${constants.RAG_CACHE_KEYS.queryVectors}:${text}`
  const cached = await readCache<number[]>(cacheKey)
  if (cached) {
    return cached
  }

  const vector = embedText(text)
  await writeCache(cacheKey, vector)
  return vector
}
