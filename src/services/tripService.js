const tripRepository = require("../repositories/tripRepository")
const AppError = require("../utils/AppError")
const { checkAvailability } = require("./availabilityService")
const Truck = require("../models/Truck")
const Trailer = require("../models/Trailer")
const { calcMileage, calcConsumption } = require("./mileageService")
const Tire = require("../models/Tire")
const { checkVehicleAlerts, checkTireAlerts } = require("./alertService")
const checkDates = (start, end) => {
  if (new Date(end) <= new Date(start))
    throw new AppError("La date de fin doit être après la date de début", 400)
}
const getAllTrips = async (filters) => {
  const query = {}
  if (filters.status)
    query.status = filters.status
  if (filters.driver)
    query.driver = filters.driver
  if (filters.truck)
    query.truck = filters.truck
  return await tripRepository.findAll(query)
}
const getTripById = async (id) => {
  const trip = await tripRepository.findById(id)
  if (!trip)
    throw new AppError("Trajet introuvable", 404)
  return trip
}
const createTrip = async (data) => {
  checkDates(data.plannedStartDate, data.plannedEndDate)
  await checkAvailability(data)
  const trip = await tripRepository.create(data)
  try {
    await checkAvailability(data, trip._id)
  } catch (error) {
    await tripRepository.remove(trip)
    throw error
  }
  return trip
}
const updateTrip = async (id, data) => {
  const trip = await tripRepository.findDocumentById(id)
  if (!trip)
    throw new AppError("Trajet introuvable", 404)
  if (trip.status !== "todo")
    throw new AppError("Seul un trajet à faire peut être modifié", 409)
  Object.assign(trip, data)
  checkDates(trip.plannedStartDate, trip.plannedEndDate)
  await checkAvailability(trip, trip._id)
  await tripRepository.save(trip)
  return trip
}
const deleteTrip = async (id) => {
  const trip = await tripRepository.findDocumentById(id)
  if (!trip)
    throw new AppError("Trajet introuvable", 404)
  if (trip.status !== "todo")
    throw new AppError("Seul un trajet à faire peut être supprimé", 409)
  await tripRepository.remove(trip)
  return { message: "Trajet supprimé" }
}
const getMyTrips = async (driverId, filters) => {
  const query = { driver: driverId }
  if (filters.status) query.status = filters.status
  return await tripRepository.findAll(query)
}
const getMyTrip = async (tripId, driverId) => {
  const trip = await tripRepository.findOneForDriver(tripId, driverId)
  if (!trip) throw new AppError("Trajet introuvable", 404)
  return trip
}
const nextStatus = { todo: "in_progress", in_progress: "completed" }
const updateMyTripStatus = async (tripId, driverId, data) => {
  const trip = await tripRepository.findDocumentForDriver(tripId, driverId)
  if (!trip) throw new AppError("Trajet introuvable", 404)
  if (nextStatus[trip.status] !== data.status)
    throw new AppError("Changement de statut interdit", 409)
  if (data.notes) trip.notes = data.notes
  if (data.status === "in_progress") trip.startMileage = data.startMileage
  if (data.status === "completed") {
    if (data.endMileage <= trip.startMileage)
      throw new AppError("Le kilométrage d'arrivée doit être strictement supérieur au kilométrage de départ", 400)
    trip.endMileage = data.endMileage
    trip.fuelConsumed = data.fuelConsumed
  }
  trip.status = data.status
  await tripRepository.save(trip)
  if (data.status !== "completed")
    return trip
  const totalMileage = calcMileage(trip.startMileage, trip.endMileage)
  await Truck.findByIdAndUpdate(trip.truck, { $inc: { currentMileage: totalMileage } })
  await Trailer.findByIdAndUpdate(trip.trailer, { $inc: { currentMileage: totalMileage } })
  await Tire.updateMany({ truck: trip.truck }, { $inc: { currentMileage: totalMileage } })
  await checkVehicleAlerts("truck", trip.truck)
  await checkVehicleAlerts("trailer", trip.trailer)
  await checkTireAlerts(trip.truck)
  return { ...trip.toObject(), totalMileage, consumption: calcConsumption(trip.fuelConsumed, totalMileage) }
}
const getMyTripForPdf = async (tripId, driverId) => {
  const trip = await tripRepository.findOneForDriverWithDetails(tripId, driverId)
  if (!trip) throw new AppError("Trajet introuvable", 404)
  return trip
}
module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getMyTrips,
  getMyTrip,
  updateMyTripStatus,
  getMyTripForPdf
}