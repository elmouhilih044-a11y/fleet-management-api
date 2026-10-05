const Truck= require("../models/Truck")
const AppError= require("../utils/AppError")
const getAllTrucks= async (filters)=> {
  const query= {}
  if(filters.status) query.status= filters.status
  if(filters.brand) query.brand= filters.brand
  return await Truck.find(query)
}
const getTruckById= async(id)=>{
  const truck= await Truck.findById(id)
  if (!truck){
    throw new AppError("Camion introuvable", 404)
  }
  return truck
}

const createTruck= async(data)=>{
  const existe= await Truck.findOne({ registrationNumber: data.registrationNumber })

  if (existe){
    throw new AppError("Cette immatriculation existe déjà", 409)
  }

  return await Truck.create(data)
}

const updateTruck= async(id, data)=>{
  const truck= await getTruckById(id)
  if(data.registrationNumber && data.registrationNumber !== truck.registrationNumber){
    const existe= await Truck.findOne({ registrationNumber: data.registrationNumber })

    if(existe){
      throw new AppError("Cette immatriculation existe déjà", 409)
    }
  }
  Object.assign(truck, data)
  await truck.save()

  return truck
}
const archiveTruck= async (id)=>{
  const truck= await getTruckById(id)
  truck.status= "inactive"
  await truck.save()
  return truck
}

module.exports= { 
     getAllTrucks,
     getTruckById, 
     createTruck, 
     updateTruck, 
     archiveTruck
     }