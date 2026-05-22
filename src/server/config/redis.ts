import Redis from "ioredis";
import { env } from "./env";

export const redis = env.redisUrl
  ? new Redis(env.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    })
  : null;

export const connectRedis = async () => {
  if (!redis) return;
  try {
    await redis.connect();
    console.log("Redis conectado para cache de métricas.");
  } catch (error) {
    console.warn("Redis indisponível; seguindo sem cache.", error);
  }
};

export const cache = {
  async getJson<T>(key: string): Promise<T | null> {
    if (!redis || redis.status !== "ready") return null;
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  },
  async setJson(key: string, value: unknown, ttlSeconds = 60) {
    if (!redis || redis.status !== "ready") return;
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  },
  async del(key: string) {
    if (!redis || redis.status !== "ready") return;
    await redis.del(key);
  },
};
