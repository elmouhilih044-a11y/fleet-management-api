const jwt= require("jsonwebtoken")
const AppError= require("../utils/AppError")

const auth= (req,res,next)=> {
  try{
    const authHeader= req.headers.authorization
    if (!authHeader){
      return next(new AppError("Token manquant", 401))
    }

    const parts= authHeader.split(" ")

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next(new AppError("Format du token invalide", 401))
    }
    const decoded= jwt.verify(parts[1], process.env.JWT_SECRET)
    req.user= decoded
    next()

  }catch(error){
    next(new AppError("Token invalide ou expiré", 401))
  }
}

module.exports= auth