// config/redis.js
const { createClient } = require("redis");

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: REDIS_URL,
});

// Basic logging
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("reconnecting", () => {
  console.log("Reconnecting to Redis...");
});

// Immediately try to connect (fail gracefully - Redis is optional)
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    // Redis is optional - fail silently in production
    if (process.env.NODE_ENV !== 'production') {
      console.error("Failed to connect to Redis:", err.message);
    }
  }
})();

module.exports = redisClient;
