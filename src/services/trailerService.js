const Trailer= require("../models/Trailer")
const AppError= require("../utils/AppError")

const getAllTrailers= async(filters)=>{
  const query= {}
  if(filters.status)
    query.status= filters.status
  
     
  if(filters.type) 
    query.type= filters.type
  return await Trailer.find(query)
}
const getTrailerById= async(id)=> {
  const trailer= await Trailer.findById(id)
  if (!trailer)
     throw new AppError("Remorque introuvable", 404)
  return trailer
}

const createTrailer= async(data)=> {
  const existe= await Trailer.findOne({ registrationNumber: data.registrationNumber })
  if(existe) 
    throw new AppError("Cette immatriculation existe déjà", 409)
  return await Trailer.create(data)
}

const updateTrailer= async (id, data)=>{
  const trailer= await getTrailerById(id)
  if(data.registrationNumber && data.registrationNumber !== trailer.registrationNumber){
    const existe= await Trailer.findOne({ registrationNumber: data.registrationNumber })
    if(existe) 
        throw new AppError("Cette immatriculation existe déjà", 409)
  }
  Object.assign(trailer, data)
  await trailer.save()
  return trailer
}

const archiveTrailer= async(id)=> {
  const trailer= await getTrailerById(id)
  trailer.status= "inactive"
  await trailer.save()
  return trailer
}

module.exports= {
    getAllTrailers,
    getTrailerById,
    createTrailer,
    updateTrailer,
    archiveTrailer 
}