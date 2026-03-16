
export default {
  CHAT_MODEL:
    import.meta.env.VITE_CHAT_MODEL ?? 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
  RAG_EMBEDDING_MODEL:
    import.meta.env.VITE_RAG_EMBEDDING_MODEL ?? 'local-hash-embedding-v1',
  RAG_INDEX_URL: import.meta.env.VITE_RAG_INDEX_URL ?? '/rag/manifest.json',
  RAG_CHUNKS_URL: import.meta.env.VITE_RAG_CHUNKS_URL ?? '/rag/chunks.json',
  RAG_EMBEDDINGS_URL:
    import.meta.env.VITE_RAG_EMBEDDINGS_URL ?? '/rag/embeddings.json',
  RAG_INDEX_NAME: import.meta.env.VITE_RAG_INDEX_NAME,
  RAG_INDEX_VERSION: import.meta.env.VITE_RAG_INDEX_VERSION,
  RAG_INDEX_ID: import.meta.env.VITE_RAG_INDEX_ID,
  RAG_INDEX_TYPE: import.meta.env.VITE_RAG_INDEX_TYPE,
  RAG_INDEX_SIZE: import.meta.env.VITE_RAG_INDEX_SIZE,
  RAG_SEARCH_DEFAULTS: {
    topK: 3,
    priorityWeight: 0.08,
    minimumScore: 0.18,
    maxContextCharacters: 1600,
  },
  RAG_CACHE_KEYS: {
    queryVectors: 're-rag-query-vectors',
  },
}
