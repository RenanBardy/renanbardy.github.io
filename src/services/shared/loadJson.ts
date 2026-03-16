export const loadJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`)
  }

  return response.json() as Promise<T>
}
