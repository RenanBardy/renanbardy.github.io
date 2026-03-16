import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const contentDir = path.join(rootDir, 'content')
const outputDir = path.join(rootDir, 'public', 'rag')

const chunkConfig = {
  targetLength: 420,
  overlap: 60,
}
const embeddingDimensions = 256

const now = new Date().toISOString()

const stableId = (value) =>
  createHash('sha1').update(value).digest('hex').slice(0, 12)

const normalizeText = (value) =>
  value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()

const tokenize = (value) =>
  normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{Letter}\p{Number}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1)

const hashToken = (token) => {
  let hash = 0
  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) >>> 0
  }
  return hash
}

const embedText = (value) => {
  const vector = new Array(embeddingDimensions).fill(0)
  const tokens = tokenize(value)

  for (const token of tokens) {
    const hash = hashToken(token)
    const index = hash % embeddingDimensions
    const sign = hash % 2 === 0 ? 1 : -1
    vector[index] += sign
  }

  const magnitude = Math.sqrt(vector.reduce((sum, item) => sum + item * item, 0))
  if (magnitude === 0) {
    return vector
  }

  return vector.map((item) => Number((item / magnitude).toFixed(8)))
}

const parseScalar = (value) => {
  const trimmed = value.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed)
  }

  return trimmed.replace(/^['"]|['"]$/g, '')
}

const parseFrontmatter = (raw) => {
  if (!raw.startsWith('---\n')) {
    throw new Error('Markdown file is missing frontmatter block')
  }

  const endIndex = raw.indexOf('\n---\n', 4)
  if (endIndex === -1) {
    throw new Error('Markdown frontmatter block is not closed')
  }

  const frontmatterBlock = raw.slice(4, endIndex)
  const body = raw.slice(endIndex + 5)
  const attributes = {}

  for (const line of frontmatterBlock.split('\n')) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1)
    attributes[key] = parseScalar(value)
  }

  return {
    attributes,
    body: normalizeText(body),
  }
}

const validateDocument = (fileName, attributes, body) => {
  const kind = typeof attributes.kind === 'string' ? attributes.kind : null
  const title = typeof attributes.title === 'string' ? attributes.title : null
  const tags = Array.isArray(attributes.tags) ? attributes.tags : []
  const priority =
    typeof attributes.priority === 'number' ? attributes.priority : null

  if (!kind || !title || tags.length === 0 || priority === null || !body) {
    throw new Error(`Invalid content metadata in ${fileName}`)
  }

  return {
    kind,
    title,
    tags,
    priority,
  }
}

const splitParagraphs = (body) =>
  body
    .split('\n\n')
    .map((paragraph) => normalizeText(paragraph))
    .filter(Boolean)

const createChunks = ({ source, kind, title, tags, priority, body }) => {
  const paragraphs = splitParagraphs(body)
  const chunks = []
  let buffer = ''

  const flush = () => {
    const text = normalizeText(buffer)
    if (!text) {
      return
    }

    const id = stableId(`${source}:${title}:${chunks.length}:${text}`)
    chunks.push({
      id,
      kind,
      title,
      tags,
      text,
      priority,
      source,
    })
  }

  for (const paragraph of paragraphs) {
    const nextText = buffer ? `${buffer}\n\n${paragraph}` : paragraph

    if (nextText.length <= chunkConfig.targetLength) {
      buffer = nextText
      continue
    }

    flush()

    const overlapText =
      buffer.length > chunkConfig.overlap
        ? buffer.slice(-chunkConfig.overlap).trim()
        : buffer.trim()

    buffer = overlapText ? `${overlapText}\n\n${paragraph}` : paragraph

    if (buffer.length > chunkConfig.targetLength) {
      flush()
      buffer = ''
    }
  }

  flush()
  return chunks
}

const build = async () => {
  const files = (await readdir(contentDir)).filter((fileName) =>
    fileName.endsWith('.md')
  )

  const allChunks = []

  for (const fileName of files) {
    const raw = await readFile(path.join(contentDir, fileName), 'utf8')
    const { attributes, body } = parseFrontmatter(raw)
    const metadata = validateDocument(fileName, attributes, body)
    const source = `content/${fileName}`
    const chunks = createChunks({ ...metadata, body, source })
    allChunks.push(...chunks)
  }

  const manifest = {
    version: 1,
    generatedAt: now,
    contentFiles: files.length,
    chunkCount: allChunks.length,
    embeddingModel: 'local-hash-embedding-v1',
    embeddingDimensions,
    chunkConfig,
    status: 'ready',
  }

  const embeddings = {
    model: manifest.embeddingModel,
    dimensions: embeddingDimensions,
    generatedAt: now,
    status: 'ready',
    vectors: allChunks.map((chunk) => ({
      chunkId: chunk.id,
      values: embedText(chunk.text),
    })),
  }

  await mkdir(outputDir, { recursive: true })
  await writeFile(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  )
  await writeFile(
    path.join(outputDir, 'chunks.json'),
    JSON.stringify(allChunks, null, 2) + '\n'
  )
  await writeFile(
    path.join(outputDir, 'embeddings.json'),
    JSON.stringify(embeddings, null, 2) + '\n'
  )
}

build().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
