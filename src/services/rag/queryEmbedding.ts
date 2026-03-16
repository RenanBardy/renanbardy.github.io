import constants from '@/config/constants'
import { embedText } from './embed'
import { readCache, writeCache } from './cache'

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
