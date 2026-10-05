const AppError= require("../utils/AppError")

const authorize= (...roles)=>{
  return (req, res, next)=>{
    if (!req.user){
      return next(new AppError("Utilisateur non authentifié", 401))
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Accès interdit", 403))
    }
    next()
  }
}

module.exports= authorize