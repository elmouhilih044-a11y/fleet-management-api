const MaintenanceRule= require("../models/MaintenanceRule")
const AppError= require("../utils/AppError")
const MaintenanceAlert= require("../models/MaintenanceAlert")
const Tire= require("../models/Tire")

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

const getAllAlerts= async(filters)=> {
  const query= {}
  if(filters.status) 
    query.status= filters.status
  if(filters.vehicleType)
     query.vehicleType= filters.vehicleType
  return await MaintenanceAlert.find(query).sort({ createdAt: -1 })
}

const resolveAlert= async(id)=> {
  const alert= await MaintenanceAlert.findById(id)
  if(!alert) 
    throw new AppError("Alerte introuvable", 404)
  if(alert.status === "resolved") 
    throw new AppError("Alerte déjà traitée", 409)
  if(alert.vehicleType === "tire"){
    const tire= await Tire.findById(alert.vehicle)
    if(tire){
      tire.status= "good"
      tire.installationMileage= tire.currentMileage
      await tire.save()
    }
  }
  alert.status= "resolved"
  await alert.save()
  return alert
}

module.exports= {
     getAllRules,
      createRule, 
      updateRule,
       deleteRule,
       getAllAlerts,
       resolveAlert

     }