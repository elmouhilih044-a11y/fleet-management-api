const env= require("./src/config/env")
const app= require("./src/app")
const connectDb= require("./src/config/db")

const startServer= async ()=> {
    try {
        await connectDb()
        app.listen(env.port, ()=> {
            console.log(`Serveur démarré sur le port ${env.port}`)
        })
    } catch (error) {
        console.error("Erreur lors du démarrage du serveur :", error.message)
        process.exit(1)
    }
}

startServer()