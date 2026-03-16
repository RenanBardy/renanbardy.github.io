import constants from '@/config/constants'
import { loadJson } from '@/utils/loadJson'
import type { RagChunk, RagEmbeddingsFile, RagIndex, RagManifest } from './types'

const resolveChunkVectors = (
  chunks: RagChunk[],
  embeddingsFile: RagEmbeddingsFile
) => {
  const vectors = new Map<string, number[]>(
    embeddingsFile.vectors
      .filter((entry) => entry.values.length > 0)
      .map((entry) => [entry.chunkId, entry.values])
  )

  if (vectors.size !== chunks.length) {
    throw new Error(
      'RAG embeddings are incomplete. Run the generation script before starting the app.'
    )
  }

  return vectors
}

export const createRagIndex = async (): Promise<RagIndex> => {
  const [manifest, chunks, embeddingsFile] = await Promise.all([
    loadJson<RagManifest>(constants.RAG_INDEX_URL),
    loadJson<RagChunk[]>(constants.RAG_CHUNKS_URL),
    loadJson<RagEmbeddingsFile>(constants.RAG_EMBEDDINGS_URL),
  ])

  return {
    manifest,
    chunks,
    vectors: resolveChunkVectors(chunks, embeddingsFile),
  }
}
