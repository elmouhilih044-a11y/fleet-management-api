const app= require("./app")
const connectDb= require("./config/db")
const PORT= 3000;
const startServer= async()=> {
    try {
        await connectDb()
        app.listen(PORT,()=> {
            console.log(`Serveur démarré sur le port ${PORT}`);
        })
    }catch(error){
        console.error("Erreur lors du démarrage du serveur :", error.message);
        process.exit(1);
    }
}
startServer();