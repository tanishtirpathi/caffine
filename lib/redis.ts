import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

let redisConnected = false;

export async function getRedisClient() {
  if (!redisConnected) {
    await redis.connect();
    redisConnected = true;
  }

  return redis;
}