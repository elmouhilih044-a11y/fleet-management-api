const maintenanceService= require("../services/maintenanceService")

const getAllRules= async(req, res, next)=>{
  try {
    res.status(200).json(await maintenanceService.getAllRules(req.query))
  }catch(error){
    next(error)
  }
}

const createRule= async(req, res, next)=>{
  try{
    res.status(201).json(await maintenanceService.createRule(req.body))
  }catch(error){
    next(error)
  }
}

const updateRule= async(req, res, next)=>{
  try{
    res.status(200).json(await maintenanceService.updateRule(req.params.id, req.body))
  }catch (error){
    next(error)
  }
}

const deleteRule= async(req, res, next)=>{
  try {
    res.status(200).json(await maintenanceService.deleteRule(req.params.id))
  }catch(error){
    next(error)
  }
}

module.exports= {
     getAllRules,
      createRule, 
      updateRule, 
      deleteRule 
    }