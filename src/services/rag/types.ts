export interface RagChunk {
  id: string
  kind: string
  title: string
  tags: string[]
  text: string
  priority: number
  source: string
}

export interface RagManifest {
  version: number
  generatedAt: string
  contentFiles: number
  chunkCount: number
  embeddingModel: string
  embeddingDimensions: number | null
  chunkConfig: {
    targetLength: number
    overlap: number
  }
  status: string
}

export interface RagEmbeddingEntry {
  chunkId: string
  values: number[]
}

export interface RagEmbeddingsFile {
  model: string
  dimensions: number | null
  generatedAt: string
  status: string
  vectors: RagEmbeddingEntry[]
}

export interface RagSearchResult {
  chunk: RagChunk
  score: number
}

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
