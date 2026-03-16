import {
  CreateWebWorkerMLCEngine,
  type InitProgressReport,
  type WebWorkerMLCEngine,
} from '@mlc-ai/web-llm'
import constants from '@/config/constants'


export const createEngineLoader = () => {
  let enginePromise: Promise<WebWorkerMLCEngine> | null = null

  const loadChatModel = async (
    onProgress?: (report: InitProgressReport) => void
  ) => {
    if (!enginePromise) {
      const worker = new Worker(new URL('./chat.worker.ts', import.meta.url), {
        type: 'module',
      })

      enginePromise = CreateWebWorkerMLCEngine(worker, constants.CHAT_MODEL, {
        initProgressCallback: (report) => {
          onProgress?.(report)
        },
      })
    }

    return enginePromise
  }

  const getLoadedEngine = async () => {
    const engine = await enginePromise
    if (!engine) {
      throw new Error('Chat model is not available')
    }

    return engine
  }

  return {
    loadChatModel,
    getLoadedEngine,
  }
}
