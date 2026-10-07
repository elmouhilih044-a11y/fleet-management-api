const tripService= require("../services/tripService")

const getAllTrips= async(req,res,next)=> {
  try {
    res.status(200).json(await tripService.getAllTrips(req.query))
  }catch(error){
    next(error)
  }
}
const getTripById= async(req,res,next)=> {
  try {
    res.status(200).json(await tripService.getTripById(req.params.id))
  }catch(error){
    next(error)
  }
}
const createTrip= async (req,res,next)=> {
  try{
    res.status(201).json(await tripService.createTrip(req.body))
  }catch(error){
    next(error)
  }
}
const updateTrip= async(req,res,next)=> {
  try{
    res.status(200).json(await tripService.updateTrip(req.params.id,req.body))
  }catch(error){
    next(error)
  }
}
const deleteTrip= async (req, res, next)=> {
  try {
    res.status(200).json(await tripService.deleteTrip(req.params.id))
  }catch(error){
    next(error)
  }
}
const getMyTrips= async(req, res, next)=>{
  try{
    res.status(200).json(await tripService.getMyTrips(req.user.userId, req.query))
  }catch(error){
    next(error)
  }
}

const getMyTrip= async(req, res, next)=>{
  try{
    res.status(200).json(await tripService.getMyTrip(req.params.id, req.user.userId))
  }catch(error){
    next(error)
  }
}
const updateMyTripStatus= async(req,res,next)=>{
  try{
    res.status(200).json(await tripService.updateMyTripStatus(req.params.id, req.user.userId, req.body))
  }catch(error){
    next(error)
  }
}
module.exports= { 
    getAllTrips, 
    getTripById, 
    createTrip, 
    updateTrip, 
    deleteTrip,
    getMyTrips,
    getMyTrip,
    updateMyTripStatus

}