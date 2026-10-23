jest.mock("../../src/repositories/tripRepository", ()=> ({ findAll: jest.fn(), findById: jest.fn(), findOneForDriver: jest.fn(), findOneForDriverWithDetails: jest.fn(), findDocumentById: jest.fn(), findDocumentForDriver: jest.fn(), create: jest.fn(), save: jest.fn(), remove: jest.fn() }))
jest.mock("../../src/services/availabilityService", ()=> ({ checkAvailability: jest.fn() }))
jest.mock("../../src/services/alertService", ()=> ({ checkVehicleAlerts: jest.fn(), checkTireAlerts: jest.fn() }))
jest.mock("../../src/services/mileageService", ()=> ({ calcMileage: jest.fn(()=> 500), calcConsumption: jest.fn(()=> 30) }))
jest.mock("../../src/models/Truck", ()=> ({ findByIdAndUpdate: jest.fn() }))
jest.mock("../../src/models/Trailer", ()=> ({ findByIdAndUpdate: jest.fn() }))
jest.mock("../../src/models/Tire", ()=> ({ updateMany: jest.fn() }))
const tripRepository= require("../../src/repositories/tripRepository")
const { checkAvailability }= require("../../src/services/availabilityService")
const { checkVehicleAlerts, checkTireAlerts }= require("../../src/services/alertService")
const Truck= require("../../src/models/Truck")
const tripService= require("../../src/services/tripService")
const validData= { departureSite: "Youssoufia", arrivalSite: "Safi", goods: "Phosphate", plannedStartDate: "2026-11-01T08:00:00Z", plannedEndDate: "2026-11-02T08:00:00Z", driver: "d1", truck: "t1", trailer: "r1" }
const makeTrip= (extra= {})=> ({ status: "todo", truck: "t1", trailer: "r1", toObject: ()=> ({ _id: "trip1" }), ...extra })
beforeEach(()=> {
  jest.clearAllMocks()
  checkAvailability.mockResolvedValue(undefined)
  checkVehicleAlerts.mockResolvedValue(undefined)
  checkTireAlerts.mockResolvedValue(undefined)
})
describe("lecture des trajets", ()=> {
  test("getAllTrips applique les filtres", async ()=> {
    tripRepository.findAll.mockResolvedValue([])
    await tripService.getAllTrips({ status: "todo", driver: "d1", truck: "t1" })
    expect(tripRepository.findAll).toHaveBeenCalledWith({ status: "todo", driver: "d1", truck: "t1" })
  })
  test("getTripById renvoie 404 si le trajet n'existe pas", async ()=> {
    tripRepository.findById.mockResolvedValue(null)
    await expect(tripService.getTripById("x")).rejects.toThrow("Trajet introuvable")
  })
  test("getTripById renvoie le trajet", async ()=> {
    tripRepository.findById.mockResolvedValue({ _id: "trip1" })
    await expect(tripService.getTripById("trip1")).resolves.toEqual({ _id: "trip1" })
  })
  test("getMyTrips filtre par chauffeur et statut", async ()=> {
    tripRepository.findAll.mockResolvedValue([])
    await tripService.getMyTrips("d1", { status: "completed" })
    expect(tripRepository.findAll).toHaveBeenCalledWith({ driver: "d1", status: "completed" })
  })
  test("getMyTrip renvoie 404 si le trajet est celui d'un autre chauffeur", async ()=> {
    tripRepository.findOneForDriver.mockResolvedValue(null)
    await expect(tripService.getMyTrip("trip1", "d2")).rejects.toThrow("Trajet introuvable")
  })
  test("getMyTrip renvoie le trajet du chauffeur", async ()=> {
    tripRepository.findOneForDriver.mockResolvedValue({ _id: "trip1" })
    await expect(tripService.getMyTrip("trip1", "d1")).resolves.toEqual({ _id: "trip1" })
  })
  test("getMyTripForPdf renvoie 404 si introuvable", async ()=> {
    tripRepository.findOneForDriverWithDetails.mockResolvedValue(null)
    await expect(tripService.getMyTripForPdf("trip1", "d1")).rejects.toThrow("Trajet introuvable")
  })
  test("getMyTripForPdf renvoie le trajet avec ses détails", async ()=> {
    tripRepository.findOneForDriverWithDetails.mockResolvedValue({ _id: "trip1" })
    await expect(tripService.getMyTripForPdf("trip1", "d1")).resolves.toEqual({ _id: "trip1" })
  })
})
describe("createTrip", ()=> {
  test("refuse une date de fin avant le début", async ()=> {
    await expect(tripService.createTrip({ ...validData, plannedEndDate: "2026-10-31T08:00:00Z" })).rejects.toThrow("La date de fin doit être après la date de début")
    expect(tripRepository.create).not.toHaveBeenCalled()
  })
  test("crée le trajet quand tout est disponible", async ()=> {
    tripRepository.create.mockResolvedValue({ _id: "trip1" })
    const trip= await tripService.createTrip(validData)
    expect(trip._id).toBe("trip1")
    expect(checkAvailability).toHaveBeenCalledTimes(2)
  })
  test("refuse l'assignation si la disponibilité échoue (409)", async ()=> {
    checkAvailability.mockRejectedValue(new Error("Camion déjà occupé sur cette période"))
    await expect(tripService.createTrip(validData)).rejects.toThrow("Camion déjà occupé")
    expect(tripRepository.create).not.toHaveBeenCalled()
  })
  test("supprime le trajet si un conflit apparaît juste après la création", async ()=> {
    const created= { _id: "trip1" }
    tripRepository.create.mockResolvedValue(created)
    checkAvailability.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("Camion déjà occupé sur cette période"))
    await expect(tripService.createTrip(validData)).rejects.toThrow("Camion déjà occupé")
    expect(tripRepository.remove).toHaveBeenCalledWith(created)
  })
})
describe("updateTrip et deleteTrip", ()=> {
  test("updateTrip renvoie 404 si le trajet n'existe pas", async ()=> {
    tripRepository.findDocumentById.mockResolvedValue(null)
    await expect(tripService.updateTrip("x", {})).rejects.toThrow("Trajet introuvable")
  })
  test("updateTrip refuse un trajet qui n'est plus à faire", async ()=> {
    tripRepository.findDocumentById.mockResolvedValue({ status: "in_progress" })
    await expect(tripService.updateTrip("trip1", {})).rejects.toThrow("Seul un trajet à faire peut être modifié")
  })
  test("updateTrip modifie et sauvegarde un trajet à faire", async ()=> {
    const trip= { _id: "trip1", status: "todo", plannedStartDate: "2026-11-01T08:00:00Z", plannedEndDate: "2026-11-02T08:00:00Z" }
    tripRepository.findDocumentById.mockResolvedValue(trip)
    const result= await tripService.updateTrip("trip1", { goods: "Sable" })
    expect(result.goods).toBe("Sable")
    expect(checkAvailability).toHaveBeenCalledWith(trip, "trip1")
    expect(tripRepository.save).toHaveBeenCalledWith(trip)
  })
  test("deleteTrip renvoie 404 si le trajet n'existe pas", async ()=> {
    tripRepository.findDocumentById.mockResolvedValue(null)
    await expect(tripService.deleteTrip("x")).rejects.toThrow("Trajet introuvable")
  })
  test("deleteTrip refuse un trajet en cours", async ()=> {
    tripRepository.findDocumentById.mockResolvedValue({ status: "in_progress" })
    await expect(tripService.deleteTrip("trip1")).rejects.toThrow("Seul un trajet à faire peut être supprimé")
  })
  test("deleteTrip supprime un trajet à faire", async ()=> {
    const trip= { status: "todo" }
    tripRepository.findDocumentById.mockResolvedValue(trip)
    await expect(tripService.deleteTrip("trip1")).resolves.toEqual({ message: "Trajet supprimé" })
    expect(tripRepository.remove).toHaveBeenCalledWith(trip)
  })
})
describe("updateMyTripStatus", ()=> {
  test("renvoie 404 si le trajet n'appartient pas au chauffeur", async ()=> {
    tripRepository.findDocumentForDriver.mockResolvedValue(null)
    await expect(tripService.updateMyTripStatus("trip1", "d2", { status: "in_progress" })).rejects.toThrow("Trajet introuvable")
  })
  test("interdit de sauter une étape (à faire vers terminé)", async ()=> {
    tripRepository.findDocumentForDriver.mockResolvedValue(makeTrip())
    await expect(tripService.updateMyTripStatus("trip1", "d1", { status: "completed" })).rejects.toThrow("Changement de statut interdit")
  })
  test("interdit tout retour en arrière (terminé vers en cours)", async ()=> {
    tripRepository.findDocumentForDriver.mockResolvedValue(makeTrip({ status: "completed" }))
    await expect(tripService.updateMyTripStatus("trip1", "d1", { status: "in_progress" })).rejects.toThrow("Changement de statut interdit")
  })
  test("démarre le trajet et enregistre le kilométrage de départ", async ()=> {
    const trip= makeTrip()
    tripRepository.findDocumentForDriver.mockResolvedValue(trip)
    const result= await tripService.updateMyTripStatus("trip1", "d1", { status: "in_progress", startMileage: 1000, notes: "Départ" })
    expect(result.status).toBe("in_progress")
    expect(result.startMileage).toBe(1000)
    expect(result.notes).toBe("Départ")
    expect(tripRepository.save).toHaveBeenCalledWith(trip)
    expect(Truck.findByIdAndUpdate).not.toHaveBeenCalled()
  })
  test("refuse un kilométrage d'arrivée inférieur ou égal au départ", async ()=> {
    tripRepository.findDocumentForDriver.mockResolvedValue(makeTrip({ status: "in_progress", startMileage: 1000 }))
    await expect(tripService.updateMyTripStatus("trip1", "d1", { status: "completed", endMileage: 1000, fuelConsumed: 100 })).rejects.toThrow("strictement supérieur")
    expect(tripRepository.save).not.toHaveBeenCalled()
  })
  test("termine le trajet, met à jour les kilométrages et déclenche les alertes", async ()=> {
    tripRepository.findDocumentForDriver.mockResolvedValue(makeTrip({ status: "in_progress", startMileage: 1000 }))
    const result= await tripService.updateMyTripStatus("trip1", "d1", { status: "completed", endMileage: 1500, fuelConsumed: 150 })
    expect(result.totalMileage).toBe(500)
    expect(result.consumption).toBe(30)
    expect(Truck.findByIdAndUpdate).toHaveBeenCalledWith("t1", { $inc: { currentMileage: 500 } })
    expect(checkVehicleAlerts).toHaveBeenCalledWith("truck", "t1")
    expect(checkVehicleAlerts).toHaveBeenCalledWith("trailer", "r1")
    expect(checkTireAlerts).toHaveBeenCalledWith("t1")
  })
})