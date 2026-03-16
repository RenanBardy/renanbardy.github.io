import constants from '@/config/constants'
import type { RagChunk, RagEmbeddingsFile, RagManifest } from '@/features/rag/types'
import { loadJson } from '@/services/shared/loadJson'
import type { RagIndex } from './types'
import { resolveChunkVectors } from './vectorIndex'

export const loadRagArtifacts = async () => {
  const [manifest, chunks, embeddingsFile] = await Promise.all([
    loadJson<RagManifest>(constants.RAG_INDEX_URL),
    loadJson<RagChunk[]>(constants.RAG_CHUNKS_URL),
    loadJson<RagEmbeddingsFile>(constants.RAG_EMBEDDINGS_URL),
  ])

  return {
    manifest,
    chunks,
    embeddingsFile,
  }
}

export const createRagIndex = async (): Promise<RagIndex> => {
  const { manifest, chunks, embeddingsFile } = await loadRagArtifacts()

  return {
    manifest,
    chunks,
    vectors: resolveChunkVectors(chunks, embeddingsFile),
  }
}
