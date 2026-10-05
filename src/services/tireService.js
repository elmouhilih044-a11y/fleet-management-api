const Tire= require("../models/Tire")
const Truck= require("../models/Truck")
const AppError= require("../utils/AppError")

const checkTruck= async(id)=>{
  const truck= await Truck.findById(id)
  if(!truck)
     throw new AppError("Camion introuvable", 404)
}

const getAllTires= async(filters)=>{
  const query= {}
  if(filters.truck)
     query.truck= filters.truck
  if(filters.status)
     query.status= filters.status
  return await Tire.find(query).populate("truck","registrationNumber brand model")
}

const getTireById= async(id)=> {
  const tire= await Tire.findById(id).populate("truck", "registrationNumber brand model")
  if(!tire) 
    throw new AppError("Pneu introuvable", 404)
  return tire
}

const createTire= async(data)=> {
  const existe= await Tire.findOne({serialNumber: data.serialNumber})
  if (existe)
     throw new AppError("Ce numéro de série existe déjà", 409)
  await checkTruck(data.truck)
  return await Tire.create(data)
}

const updateTire= async(id,data)=>{
  const tire= await getTireById(id)
  if(data.serialNumber && data.serialNumber !== tire.serialNumber){
    const existe= await Tire.findOne({serialNumber: data.serialNumber})
    if(existe) 
        throw new AppError("Ce numéro de série existe déjà", 409)
  }
  if(data.truck) await checkTruck(data.truck)
  Object.assign(tire, data)
  await tire.save()
  return tire
}

const deleteTire= async(id)=>{
  const tire= await getTireById(id)
  await tire.deleteOne()
  return{ message: "Pneu supprimé" }
}

module.exports= {
     getAllTires, 
     getTireById, 
     createTire, 
     updateTire, 
     deleteTire
     }