import type { RagChunk, RagEmbeddingsFile } from '@/features/rag/types'

export const resolveChunkVectors = (
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
