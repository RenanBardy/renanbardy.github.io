const DB_NAME = 're-rag-cache'
const STORE_NAME = 'kv'
const DB_VERSION = 1

const openDatabase = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
  })
}

export const readCache = async <T>(key: string): Promise<T | null> => {
  const database = await openDatabase()

  return new Promise<T | null>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).get(key)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      resolve((request.result as T | undefined) ?? null)
      database.close()
    }
  })
}

export const writeCache = async <T>(key: string, value: T) => {
  const database = await openDatabase()

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const request = transaction.objectStore(STORE_NAME).put(value, key)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      resolve()
      database.close()
    }
  })
}
