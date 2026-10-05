const tireService= require("../services/tireService")

const getAllTires= async (req, res, next)=>{
  try {
    res.status(200).json(await tireService.getAllTires(req.query))
  }catch(error){
    next(error)
  }
}
const getTireById= async (req, res, next)=>{
  try{
    res.status(200).json(await tireService.getTireById(req.params.id))
  }catch(error){
    next(error)
  }
}
const createTire= async(req, res, next)=>{
  try{
    res.status(201).json(await tireService.createTire(req.body))
  }catch (error){
    next(error)
  }
}
const updateTire= async(req, res, next)=>{
  try{
    res.status(200).json(await tireService.updateTire(req.params.id, req.body))
  }catch (error){
    next(error)
  }
}
const deleteTire= async(req, res, next)=>{
  try{
    res.status(200).json(await tireService.deleteTire(req.params.id))
  }catch (error){
    next(error)
  }
}

module.exports= {
     getAllTires, 
     getTireById, 
     createTire, 
     updateTire, 
     deleteTire 
    }