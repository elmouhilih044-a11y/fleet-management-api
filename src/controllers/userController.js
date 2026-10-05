const userService= require("../services/userService")

const getAllDrivers= async (req, res, next)=>{
  try{
    const drivers= await userService.getAllDrivers()
    res.status(200).json(drivers)
  }catch(error) {
    next(error)
  }
}

const createDriver= async(req, res, next)=>{
  try {
    const driver= await userService.createDriver(req.body)
    res.status(201).json(driver)
  } catch (error) {
    next(error)
  }
}

const suspendDriver= async (req, res, next)=>{
  try{
    const driver= await userService.changeStatus(req.params.id, "suspended")
    res.status(200).json(driver)
  }catch (error){
    next(error)
  }
}

const activateDriver= async(req, res, next)=>{
  try {
    const driver= await userService.changeStatus(req.params.id, "active")
    res.status(200).json(driver)
  } catch (error) {
    next(error)
  }
}

module.exports= { 
    getAllDrivers,
    createDriver,
    suspendDriver, 
    activateDriver 
    }