// =============================================================================
// Local Database Service - AgentricAI-planner
// IndexedDB-backed local-first storage (privacy by architecture)
// All student data stays on-device — never transmitted externally
// =============================================================================

const DB_NAME = 'agentricai-planner';
const DB_VERSION = 2;

interface DBSchema {
  profiles: { key: string; value: Record<string, unknown> };
  sessions: { key: string; value: Record<string, unknown> };
  interactions: { key: string; value: Record<string, unknown> };
  curriculum: { key: string; value: Record<string, unknown> };
  insights: { key: string; value: Record<string, unknown> };
  metrics: { key: string; value: Record<string, unknown> };
  directives: { key: string; value: Record<string, unknown> };
  progression: { key: string; value: Record<string, unknown> };
}

type StoreName = keyof DBSchema;

class DatabaseService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        const stores: StoreName[] = [
          'profiles', 'sessions', 'interactions',
          'curriculum', 'insights', 'metrics',
          'directives', 'progression'
        ];

        stores.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to open database:', request.error);
        reject(request.error);
      };
    });

    return this.initPromise;
  }

  async put<T extends Record<string, unknown>>(storeName: StoreName, data: T): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(data);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async get<T>(storeName: StoreName, id: string): Promise<T | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: StoreName, id: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear(storeName: StoreName): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const database = new DatabaseService();
export default DatabaseService;
