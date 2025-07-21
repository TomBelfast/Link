import Redis from 'ioredis';

// Konfiguracja Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Singleton Redis instance
class RedisClient {
  private static instance: Redis | null = null;
  private static isConnecting = false;

  static async getInstance(): Promise<Redis> {
    if (this.instance && this.instance.status === 'ready') {
      return this.instance;
    }

    if (this.isConnecting) {
      // Czekaj na zakończenie połączenia
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.instance!;
    }

    this.isConnecting = true;

    try {
      // Utwórz nową instancję Redis
      this.instance = new Redis(redisConfig);

      // Event handlers
      this.instance.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      this.instance.on('error', (error) => {
        console.error('❌ Redis connection error:', error);
      });

      this.instance.on('close', () => {
        console.log('🔌 Redis connection closed');
      });

      this.instance.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
      });

      // Testuj połączenie
      await this.instance.ping();
      console.log('🏓 Redis ping successful');

      this.isConnecting = false;
      return this.instance;
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
      this.isConnecting = false;
      
      // Fallback - zwróć mock Redis dla development
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Using Redis mock for development');
        return this.createMockRedis();
      }
      
      throw error;
    }
  }

  // Mock Redis dla przypadków gdy Redis nie jest dostępny
  private static createMockRedis(): any {
    const mockData = new Map<string, { value: string; expiry?: number }>();

    return {
      async get(key: string) {
        const item = mockData.get(key);
        if (!item) return null;
        
        if (item.expiry && Date.now() > item.expiry) {
          mockData.delete(key);
          return null;
        }
        
        return item.value;
      },

      async set(key: string, value: string) {
        mockData.set(key, { value });
        return 'OK';
      },

      async setex(key: string, seconds: number, value: string) {
        mockData.set(key, { 
          value, 
          expiry: Date.now() + (seconds * 1000) 
        });
        return 'OK';
      },

      async del(key: string) {
        return mockData.delete(key) ? 1 : 0;
      },

      async exists(key: string) {
        return mockData.has(key) ? 1 : 0;
      },

      async flushall() {
        mockData.clear();
        return 'OK';
      },

      async ping() {
        return 'PONG';
      },

      status: 'ready'
    };
  }

  static async disconnect() {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }
}

// Cache utility functions
export class CacheManager {
  private static redis: Redis | null = null;

  private static async getRedis() {
    if (!this.redis) {
      this.redis = await RedisClient.getInstance();
    }
    return this.redis;
  }

  // Pobierz dane z cache
  static async get<T>(key: string): Promise<T | null> {
    try {
      const redis = await this.getRedis();
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  // Zapisz dane do cache
  static async set(key: string, value: any, ttlSeconds = 300): Promise<boolean> {
    try {
      const redis = await this.getRedis();
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  // Usuń dane z cache
  static async del(key: string): Promise<boolean> {
    try {
      const redis = await this.getRedis();
      const result = await redis.del(key);
      return result > 0;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  // Usuń wiele kluczy pasujących do wzorca
  static async delPattern(pattern: string): Promise<number> {
    try {
      const redis = await this.getRedis();
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;
      
      const result = await redis.del(...keys);
      return result;
    } catch (error) {
      console.error(`Cache delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }

  // Sprawdź czy klucz istnieje
  static async exists(key: string): Promise<boolean> {
    try {
      const redis = await this.getRedis();
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  // Wyczyść cały cache
  static async flush(): Promise<boolean> {
    try {
      const redis = await this.getRedis();
      await redis.flushall();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }
}

// Export default instance
export const redis = RedisClient.getInstance();
export default CacheManager;