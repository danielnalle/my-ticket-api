import { createClient, type RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6380";

export const redisClient: RedisClientType = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) =>
  console.error("❌ Redis Client Error:", err.message),
);
redisClient.on("connect", () =>
  console.log("✅ Successfully connected to redis!"),
);

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
