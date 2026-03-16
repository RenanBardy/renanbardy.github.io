import type {
  RagChunk,
  RagManifest,
  RagSearchResult,
} from '@/features/rag/types'

export interface RagIndex {
  manifest: RagManifest
  chunks: RagChunk[]
  vectors: Map<string, number[]>
}

export interface SearchOptions {
  topK?: number
  priorityWeight?: number
  minimumScore?: number
  maxContextCharacters?: number
}

export interface RagSearchResponse {
  results: RagSearchResult[]
  contextBlocks: string[]
}

export interface RagService {
  loadRagIndex(): Promise<RagIndex>
  embedQuery(text: string): Promise<number[]>
  search(query: string, options?: SearchOptions): Promise<RagSearchResponse>
}
