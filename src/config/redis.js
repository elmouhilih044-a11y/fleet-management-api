const Redis= require("ioredis")
const env= require("./env")
const redis= new Redis(env.redisUrl, { maxRetriesPerRequest: 1 })
redis.on("error", (error)=> console.error("Redis :", error.message))
module.exports= redis