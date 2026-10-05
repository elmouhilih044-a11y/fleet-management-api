const trailerService= require("../services/trailerService")

const getAllTrailers= async(req,res,next)=> {
  try {
    res.status(200).json(await trailerService.getAllTrailers(req.query))
  }catch(error){
    next(error)
  }
}

const getTrailerById= async(req, res, next)=> {
  try{
    res.status(200).json(await trailerService.getTrailerById(req.params.id))
  }catch(error){
    next(error)
  }
}

const createTrailer= async(req, res, next)=> {
  try {
    res.status(201).json(await trailerService.createTrailer(req.body))
  }catch(error){
    next(error)
  }
}

const updateTrailer= async(req, res, next)=> {
  try{
    res.status(200).json(await trailerService.updateTrailer(req.params.id, req.body))
  }catch (error){
    next(error)
  }
}

const archiveTrailer= async(req, res, next)=> {
  try{
    res.status(200).json(await trailerService.archiveTrailer(req.params.id))
  } catch(error){
    next(error)
  }
}

module.exports= { 
    getAllTrailers,
    getTrailerById, 
    createTrailer, 
    updateTrailer, 
    archiveTrailer 
}