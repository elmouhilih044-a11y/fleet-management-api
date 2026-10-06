const Trip= require("../models/Trip")
const AppError= require("../utils/AppError")
const { checkAvailability }= require("./availabilityService")

const checkDates= (start, end)=> {
  if(new Date(end) <= new Date(start))
     throw new AppError("La date de fin doit être après la date de début", 400)
}

const populateTrip= (query)=>{
  return query.populate("driver", "firstName lastName").populate("truck", "registrationNumber").populate("trailer", "registrationNumber")
}

const getAllTrips= async (filters)=> {
  const query= {}
  if(filters.status) 
    query.status= filters.status
  if(filters.driver)
     query.driver= filters.driver
  if(filters.truck)
     query.truck= filters.truck
  return await populateTrip(Trip.find(query))
}

const getTripById= async(id)=> {
  const trip= await populateTrip(Trip.findById(id))
  if(!trip) 
    throw new AppError("Trajet introuvable", 404)
  return trip;
}

const createTrip= async (data)=> {
  checkDates(data.plannedStartDate, data.plannedEndDate)
  await checkAvailability(data)
  const trip= await Trip.create(data)
  try{
    await checkAvailability(data, trip._id)
  }catch(error){
    await trip.deleteOne()
    throw error
  }
  return trip
}

const updateTrip= async (id, data)=> {
  const trip= await Trip.findById(id)
  if(!trip)
     throw new AppError("Trajet introuvable", 404)
  if(trip.status !== "todo")
     throw new AppError("Seul un trajet à faire peut être modifié", 409)
  Object.assign(trip, data)
  checkDates(trip.plannedStartDate, trip.plannedEndDate)
  await checkAvailability(trip, trip._id)
  await trip.save()
  return trip;
}

const deleteTrip= async (id)=> {
  const trip= await Trip.findById(id)
  if(!trip)
     throw new AppError("Trajet introuvable", 404)
  if(trip.status !== "todo")
     throw new AppError("Seul un trajet à faire peut être supprimé", 409)
  await trip.deleteOne()
  return{ 
    message: "Trajet supprimé"
 }
}

const getMyTrips= async (driverId, filters)=> {
  const query= { driver: driverId }
  if (filters.status) query.status= filters.status
  return await populateTrip(Trip.find(query))
}
const getMyTrip= async (tripId, driverId)=> {
  const trip= await populateTrip(Trip.findOne({ _id: tripId, driver: driverId }))
  if (!trip) throw new AppError("Trajet introuvable", 404)
  return trip
}

module.exports= { 
    getAllTrips, 
    getTripById, 
    createTrip, 
    updateTrip, 
    deleteTrip,
    getMyTrips,
    getMyTrip

}