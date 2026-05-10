interface ImageData {
  id: string
  type: string
  technique: string
  uploadedAt: string
  dataUrl: string
}

class ImageDB {
  private dbName = 'DiaCareImages'
  private version = 1

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' })
        }
      }
    })
  }

  async saveImage(image: ImageData): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction(['images'], 'readwrite')
    const store = transaction.objectStore('images')
    await new Promise<void>((resolve, reject) => {
      const request = store.put(image)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    db.close()
  }

  async getImage(id: string): Promise<ImageData | null> {
    const db = await this.openDB()
    const transaction = db.transaction(['images'], 'readonly')
    const store = transaction.objectStore('images')
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllImages(): Promise<ImageData[]> {
    const db = await this.openDB()
    const transaction = db.transaction(['images'], 'readonly')
    const store = transaction.objectStore('images')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteImage(id: string): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction(['images'], 'readwrite')
    const store = transaction.objectStore('images')
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    db.close()
  }
}

export const imageDB = new ImageDB()
