import { CreateMLCEngine, type InitProgressReport } from '@mlc-ai/web-llm'

 const initProgressCallback = (report: InitProgressReport) => {
     console.log("Model loading progress:", report)
 }

const initEngine = async () => {
  const engine = await CreateMLCEngine('Qwen2.5-1.5B-Instruct-q4f16_1-MLC', { initProgressCallback })
  return engine
}

export { initEngine }