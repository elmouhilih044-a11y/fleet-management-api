require("dotenv").config()
const required= ["DATABASE_URL"]
const missing= required.filter((key)=> !process.env[key])
if (missing.length > 0) {
    throw new Error(`Variables d'environnement manquantes : ${missing.join(", ")}`)
}
module.exports= {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 3000,
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    minio: {
        endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000",
        publicEndpoint: process.env.MINIO_PUBLIC_ENDPOINT || "http://localhost:9000",
        user: process.env.MINIO_ROOT_USER,
        password: process.env.MINIO_ROOT_PASSWORD,
        bucket: process.env.MINIO_BUCKET || "fleettrack-documents",
        presignedTtl: Number(process.env.PRESIGNED_TTL_SECONDS) || 900
    }
}