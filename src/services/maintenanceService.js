const MaintenanceRule= require("../models/MaintenanceRule")
const AppError= require("../utils/AppError")

const getAllRules= async(filters)=> {
  const query= {}
  if (filters.vehicleType)
     query.vehicleType= filters.vehicleType
  if (filters.maintenanceType) 
    query.maintenanceType= filters.maintenanceType
  return await MaintenanceRule.find(query)
}

const createRule= async(data)=>{
  const existe= await MaintenanceRule.findOne({ vehicleType: data.vehicleType, maintenanceType: data.maintenanceType })
  if(existe) 
    throw new AppError("Cette règle existe déjà", 409)
  return await MaintenanceRule.create(data)
}

const updateRule= async (id, data)=> {
  const rule= await MaintenanceRule.findById(id)
  if (!rule)
     throw new AppError("Règle introuvable", 404)
  Object.assign(rule, data)
  await rule.save()
  return rule
}

const deleteRule= async(id)=>{
  const rule= await MaintenanceRule.findById(id)
  if(!rule)
     throw new AppError("Règle introuvable", 404)
  await rule.deleteOne()
  return { message: "Règle supprimée" }
}

module.exports= {
     getAllRules,
      createRule, 
      updateRule,
       deleteRule }