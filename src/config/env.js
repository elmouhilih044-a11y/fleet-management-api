require("dotenv").config()

const required=["DATABASE_URL"]
const missing= required.filter((key)=>!process.env[key])

if (missing.length > 0){
    throw new Error(`Variables d'environnement manquantes : ${missing.join(", ")}`)
}

module.exports= {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 3000,
    databaseUrl: process.env.DATABASE_URL
}