const truckService= require("../services/truckService")

const getAllTrucks= async (req, res, next)=>{
  try {
    const trucks= await truckService.getAllTrucks(req.query)
    res.status(200).json(trucks)
  } catch(error){
    next(error)
  }
}

const getTruckById= async (req, res, next)=>{
  try{
    const truck= await truckService.getTruckById(req.params.id)
    res.status(200).json(truck)
  }catch (error){
    next(error);
  }
}

const createTruck= async(req, res, next)=>{
  try{
    const truck= await truckService.createTruck(req.body)
    res.status(201).json(truck)
  }catch (error){
    next(error);
  }
}

const updateTruck= async(req, res, next)=>{
  try{
    const truck= await truckService.updateTruck(req.params.id, req.body)
    res.status(200).json(truck)
  }catch(error){
    next(error)
  }
}

const archiveTruck= async(req, res, next)=>{
  try{
    const truck= await truckService.archiveTruck(req.params.id)
    res.status(200).json(truck)
  }catch(error){
    next(error)
  }
}

module.exports={ 
    getAllTrucks, 
    getTruckById, 
    createTruck, 
    updateTruck, 
    archiveTruck 
}