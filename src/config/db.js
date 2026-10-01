const mongoose= require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const connectDb= async()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("MongoDB connecté")
    } catch(err){
        console.error("Erreur de connexion MongoDB :",err.message)
        process.exit(1);
    }
}

module.exports=connectDb