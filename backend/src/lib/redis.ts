import Redis from 'ioredis';

let redisClient: Redis | null = null;
let isRedisAvailable = false;

const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('[Redis] Connection retry limit exceeded. Running in cache-bypass mode.');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 2000);
      },
    });

    redisClient.on('connect', () => {
      isRedisAvailable = true;
      console.log('[Redis] Connected successfully.');
    });

    redisClient.on('error', (err) => {
      isRedisAvailable = false;
      console.warn('[Redis] Connection warning (cache bypassed):', err.message);
    });
  } catch (error) {
    console.warn('[Redis] Initialization error, running without cache:', error);
  }
} else {
  console.info('[Redis] No REDIS_URL provided. Operating in direct database mode.');
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redisClient || !isRedisAvailable) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn(`[Redis] Error getting key ${key}:`, err);
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    if (!redisClient || !isRedisAvailable) return;
    try {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.warn(`[Redis] Error setting key ${key}:`, err);
    }
  },

  async del(key: string): Promise<void> {
    if (!redisClient || !isRedisAvailable) return;
    try {
      await redisClient.del(key);
    } catch (err) {
      console.warn(`[Redis] Error deleting key ${key}:`, err);
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!redisClient || !isRedisAvailable) return;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (err) {
      console.warn(`[Redis] Error deleting pattern ${pattern}:`, err);
    }
  },
};

export default redisClient;
