const Trip= require("../models/Trip")
const Truck= require("../models/Truck")
const Trailer= require("../models/Trailer")
const User= require("../models/User")
const Tire= require("../models/Tire")
const MaintenanceAlert= require("../models/MaintenanceAlert")
const AppError= require("../utils/AppError")

const isBusy= async (field, id, start, end, tripId)=> {
  const query= {
    [field]: id,
    status: { $in: ["todo", "in_progress"] },
    plannedStartDate: { $lt: end },
    plannedEndDate: { $gt: start }
  }
  if (tripId) query._id= { $ne: tripId }
  return await Trip.exists(query)
}

const hasAlert= async (vehicleType, vehicleId)=> {
  return await MaintenanceAlert.exists({ vehicleType, vehicle: vehicleId, status: "pending" })
}

const checkAvailability= async (data, tripId)=> {
  const start= new Date(data.plannedStartDate)
  const end= new Date(data.plannedEndDate)

  const driver= await User.findById(data.driver)
  if(!driver || driver.role !== "driver")
     throw new AppError("Chauffeur introuvable", 404)
  if(driver.status === "suspended")
     throw new AppError("Chauffeur suspendu", 409)

  const truck= await Truck.findById(data.truck)
  if(!truck) throw new AppError("Camion introuvable", 404)
  if(truck.status !== "available") throw new AppError("Camion non disponible", 409)

  const trailer= await Trailer.findById(data.trailer)
  if(!trailer)
     throw new AppError("Remorque introuvable", 404)
  if(trailer.status !== "available")
     throw new AppError("Remorque non disponible", 409)

  if(await hasAlert("truck", truck._id))
     throw new AppError("Camion en alerte de maintenance", 409)
  if(await hasAlert("trailer", trailer._id))
     throw new AppError("Remorque en alerte de maintenance", 409)

  const tires= await Tire.find({ truck: truck._id })
  for (const tire of tires) {
    if (tire.status === "to_replace" || await hasAlert("tire", tire._id)) {
      throw new AppError("Un pneu du camion doit être remplacé", 409)
    }
  }

  if(await isBusy("truck", truck._id, start, end, tripId))
     throw new AppError("Camion déjà occupé sur cette période",409)
  if(await isBusy("trailer", trailer._id, start, end, tripId)) 
    throw new AppError("Remorque déjà occupée sur cette période",409)
  if(await isBusy("driver", driver._id, start, end, tripId))
     throw new AppError("Chauffeur déjà occupé sur cette période",409)
}

module.exports= { checkAvailability }