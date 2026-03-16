import { initEngine } from '@/services/WebLLM'
import { messageExchanger } from '@/services/WebLLM/messages'
import type { MLCEngine } from '@mlc-ai/web-llm'
import { useEffect, useRef, type FC } from 'react'

const App: FC = () => {
  const engineRef = useRef<MLCEngine | null>(null)
  const messageExchangerRef = useRef<ReturnType<typeof messageExchanger> | null>(null)

  useEffect(() => {
    if (engineRef.current) {
      return
    }
    initEngine().then(async (engine) => {
      console.log('Engine initialized', engine)
      engineRef.current = engine
      messageExchangerRef.current = messageExchanger(engine)
    })
    .catch((error) => {
      console.error('Error initializing engine', error)
    })
  }, [])

  return (
    <>
      <h1>LLM.E</h1>
      <button onClick={() => {
        messageExchangerRef.current?.sendMessage({ role: 'user', content: 'Hello!' }).then((response) => {
          console.log('Response', response)
        })
      }}>Generate Text</button>
      <button onClick={() => {  
        console.log(messageExchangerRef.current?.seeAllMessages())
      }}>See All Messages</button>
    </>
  )
}

export default App
