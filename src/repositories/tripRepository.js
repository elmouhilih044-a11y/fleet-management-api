const Trip= require("../models/Trip")
const populateTrip= (query)=> {
  return query.populate("driver", "firstName lastName").populate("truck", "registrationNumber").populate("trailer", "registrationNumber")
}
const findAll= async (filters= {})=> {
  return await populateTrip(Trip.find(filters))
}
const findById= async (id)=> {
  return await populateTrip(Trip.findById(id))
}
const findByIdWithDetails= async (id)=> {
  return await Trip.findById(id).populate("driver", "firstName lastName").populate("truck", "registrationNumber brand model").populate("trailer", "registrationNumber type")
}
const findOneForDriver= async (tripId, driverId)=> {
  return await populateTrip(Trip.findOne({ _id: tripId, driver: driverId }))
}
const findOneForDriverWithDetails= async (tripId, driverId)=> {
  return await Trip.findOne({ _id: tripId, driver: driverId }).populate("driver", "firstName lastName").populate("truck", "registrationNumber brand model").populate("trailer", "registrationNumber type")
}
const findDocumentById= async (id)=> {
  return await Trip.findById(id)
}
const findDocumentForDriver= async (tripId, driverId)=> {
  return await Trip.findOne({ _id: tripId, driver: driverId })
}
const create= async (data)=> {
  return await Trip.create(data)
}
const save= async (trip)=> {
  return await trip.save()
}
const remove= async (trip)=> {
  return await trip.deleteOne()
}
module.exports= { findAll, findById, findByIdWithDetails, findOneForDriver, findOneForDriverWithDetails, findDocumentById, findDocumentForDriver, create, save, remove }