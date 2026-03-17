import profileContent from '@content/profile.md?raw'
import experiencesContent from '@content/experiences.md?raw'
import skillsContent from '@content/skills.md?raw'
import projectsContent from '@content/projects.md?raw'
import { ragService } from '@/services/rag'
import type { ChatContextMode } from './types'

interface RetrievedContext {
  contextBlocks: string[]
  sources: string[]
  contextLabel: string
}

const fullContextBlocks = [
  {
    label: 'Profile',
    content: profileContent.trim(),
  },
  {
    label: 'Experiences',
    content: experiencesContent.trim(),
  },
  {
    label: 'Skills',
    content: skillsContent.trim(),
  },
  {
    label: 'Projects',
    content: projectsContent.trim(),
  },
]

const fullContextSources = fullContextBlocks.map((block) => block.label)

export const createContextProvider = () => {
  return {
    async load(mode: ChatContextMode, question: string): Promise<RetrievedContext> {
      if (mode === 'context') {
        return {
          contextBlocks: fullContextBlocks.map(
            (block) => `${block.label}\n${block.content}`
          ),
          sources: fullContextSources,
          contextLabel: 'Professional context',
        }
      }

      const { results, contextBlocks } = await ragService.search(question)

      return {
        contextBlocks,
        sources: results.map((result) => result.chunk.source),
        contextLabel: 'Retrieved context',
      }
    },
  }
}
