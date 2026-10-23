jest.mock("../../src/models/Trip", ()=> ({ exists: jest.fn() }))
jest.mock("../../src/models/Truck", ()=> ({ findById: jest.fn() }))
jest.mock("../../src/models/Trailer", ()=> ({ findById: jest.fn() }))
jest.mock("../../src/models/User", ()=> ({ findById: jest.fn() }))
jest.mock("../../src/models/Tire", ()=> ({ find: jest.fn() }))
jest.mock("../../src/models/MaintenanceAlert", ()=> ({ exists: jest.fn() }))
const Trip= require("../../src/models/Trip")
const Truck= require("../../src/models/Truck")
const Trailer= require("../../src/models/Trailer")
const User= require("../../src/models/User")
const Tire= require("../../src/models/Tire")
const MaintenanceAlert= require("../../src/models/MaintenanceAlert")
const { checkAvailability }= require("../../src/services/availabilityService")
const data= { driver: "d1", truck: "t1", trailer: "r1", plannedStartDate: "2026-11-01T08:00:00Z", plannedEndDate: "2026-11-02T08:00:00Z" }
beforeEach(()=> {
  jest.clearAllMocks()
  User.findById.mockResolvedValue({ _id: "d1", role: "driver", status: "active" })
  Truck.findById.mockResolvedValue({ _id: "t1", status: "available" })
  Trailer.findById.mockResolvedValue({ _id: "r1", status: "available" })
  Tire.find.mockResolvedValue([])
  MaintenanceAlert.exists.mockResolvedValue(null)
  Trip.exists.mockResolvedValue(null)
})
describe("chauffeur", ()=> {
  test("accepte quand tout est disponible", async ()=> {
    await expect(checkAvailability(data)).resolves.toBeUndefined()
  })
  test("refuse un chauffeur introuvable", async ()=> {
    User.findById.mockResolvedValue(null)
    await expect(checkAvailability(data)).rejects.toThrow("Chauffeur introuvable")
  })
  test("refuse un utilisateur qui n'est pas chauffeur", async ()=> {
    User.findById.mockResolvedValue({ _id: "d1", role: "admin", status: "active" })
    await expect(checkAvailability(data)).rejects.toThrow("Chauffeur introuvable")
  })
  test("refuse un chauffeur suspendu", async ()=> {
    User.findById.mockResolvedValue({ _id: "d1", role: "driver", status: "suspended" })
    await expect(checkAvailability(data)).rejects.toThrow("Chauffeur suspendu")
  })
})
describe("camion et remorque", ()=> {
  test("refuse un camion introuvable", async ()=> {
    Truck.findById.mockResolvedValue(null)
    await expect(checkAvailability(data)).rejects.toThrow("Camion introuvable")
  })
  test("refuse un camion en maintenance", async ()=> {
    Truck.findById.mockResolvedValue({ _id: "t1", status: "maintenance" })
    await expect(checkAvailability(data)).rejects.toThrow("Camion non disponible")
  })
  test("refuse une remorque introuvable", async ()=> {
    Trailer.findById.mockResolvedValue(null)
    await expect(checkAvailability(data)).rejects.toThrow("Remorque introuvable")
  })
  test("refuse une remorque en maintenance", async ()=> {
    Trailer.findById.mockResolvedValue({ _id: "r1", status: "maintenance" })
    await expect(checkAvailability(data)).rejects.toThrow("Remorque non disponible")
  })
})
describe("alertes de maintenance", ()=> {
  test("refuse un camion avec une alerte non traitée", async ()=> {
    MaintenanceAlert.exists.mockResolvedValueOnce({})
    await expect(checkAvailability(data)).rejects.toThrow("Camion en alerte de maintenance")
  })
  test("refuse une remorque avec une alerte non traitée", async ()=> {
    MaintenanceAlert.exists.mockResolvedValueOnce(null).mockResolvedValueOnce({})
    await expect(checkAvailability(data)).rejects.toThrow("Remorque en alerte de maintenance")
  })
  test("refuse un camion dont un pneu doit être remplacé", async ()=> {
    Tire.find.mockResolvedValue([{ _id: "p1", status: "to_replace" }])
    await expect(checkAvailability(data)).rejects.toThrow("Un pneu du camion doit être remplacé")
  })
  test("refuse un camion dont un pneu a une alerte non traitée", async ()=> {
    Tire.find.mockResolvedValue([{ _id: "p1", status: "good" }])
    MaintenanceAlert.exists.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({})
    await expect(checkAvailability(data)).rejects.toThrow("Un pneu du camion doit être remplacé")
  })
})
describe("conflits de période (409)", ()=> {
  test("refuse un camion déjà occupé", async ()=> {
    Trip.exists.mockResolvedValueOnce({})
    await expect(checkAvailability(data)).rejects.toThrow("Camion déjà occupé")
  })
  test("refuse une remorque déjà occupée", async ()=> {
    Trip.exists.mockResolvedValueOnce(null).mockResolvedValueOnce({})
    await expect(checkAvailability(data)).rejects.toThrow("Remorque déjà occupée")
  })
  test("refuse un chauffeur déjà occupé", async ()=> {
    Trip.exists.mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce({})
    await expect(checkAvailability(data)).rejects.toThrow("Chauffeur déjà occupé")
  })
  test("ignore le trajet en cours de modification", async ()=> {
    await checkAvailability(data, "trip1")
    expect(Trip.exists).toHaveBeenCalledWith(expect.objectContaining({ _id: { $ne: "trip1" } }))
  })
})