const MaintenanceRule= require("../models/MaintenanceRule")
const MaintenanceAlert= require("../models/MaintenanceAlert")
const Truck= require("../models/Truck")
const Trailer= require("../models/Trailer")
const Tire= require("../models/Tire")

const labels= { oil_change: "Vidange", inspection: "Révision", tire: "Changement des pneus" }
const models= { truck: Truck, trailer: Trailer }

const checkVehicleAlerts= async (vehicleType, vehicleId)=>{
  const vehicle= await models[vehicleType].findById(vehicleId)
  if(!vehicle) 
    return
  const rules= await MaintenanceRule.find({ vehicleType, isActive: true })
  for(const rule of rules){
    const filter= { vehicleType, vehicle: vehicle._id, maintenanceType: rule.maintenanceType }
    if (await MaintenanceAlert.exists({ ...filter, status: "pending" }))
         continue
    const last= await MaintenanceAlert.findOne(filter).sort({ createdAt: -1 })
    const base= last ? last.mileage : 0
    if(vehicle.currentMileage - base >= rule.mileageInterval){
      await MaintenanceAlert.create({
        ...filter,
        mileage: vehicle.currentMileage,
        message: `${labels[rule.maintenanceType]} à effectuer : ${vehicle.registrationNumber} (${vehicle.currentMileage} km)`
      })
    }
  }
}

const checkTireAlerts= async(truckId)=>{
  const tires= await Tire.find({ truck: truckId, status: { $ne: "to_replace" } })
  for (const tire of tires){
    const wear= tire.currentMileage - tire.installationMileage
    if (wear >= tire.wearThreshold) {
      tire.status= "to_replace"
      await tire.save()
      await MaintenanceAlert.create({
        vehicleType: "tire",
        vehicle: tire._id,
        maintenanceType: "tire",
        mileage: tire.currentMileage,
        message: `Pneu ${tire.serialNumber} (${tire.position}) à remplacer : ${wear} km parcourus`
      })
    }
  }
}

module.exports= { 
    checkVehicleAlerts,
     checkTireAlerts
     }