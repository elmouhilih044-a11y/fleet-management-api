jest.mock("../../src/repositories/tripRepository", ()=> ({ findByIdWithDetails: jest.fn(), save: jest.fn() }))
jest.mock("../../src/services/storageService", ()=> ({ uploadFile: jest.fn(), getDownloadUrl: jest.fn() }))
jest.mock("../../src/config/env", ()=> ({ minio: { presignedTtl: 900 } }))
const tripRepository= require("../../src/repositories/tripRepository")
const storageService= require("../../src/services/storageService")
const { getMissionOrderUrl }= require("../../src/services/missionOrderService")
const tripId= "507f1f77bcf86cd799439011"
const admin= { role: "admin", userId: "a1" }
const driver= { role: "driver", userId: "d1" }
const makeTrip= (extra= {})=> ({ _id: tripId, driver: { _id: "d1", firstName: "Ali", lastName: "Amrani" }, truck: { registrationNumber: "12345-A-1", brand: "Volvo", model: "FH" }, trailer: { registrationNumber: "R-99", type: "Frigo" }, departureSite: "Youssoufia", arrivalSite: "Safi", goods: "Phosphate", plannedStartDate: "2026-11-01T08:00:00Z", plannedEndDate: "2026-11-02T08:00:00Z", ...extra })
beforeEach(()=> {
  jest.clearAllMocks()
  storageService.getDownloadUrl.mockResolvedValue("http://signed-url")
  storageService.uploadFile.mockImplementation(async (key, buffer)=> ({ bucket: "fleettrack-documents", s3Key: key, sizeBytes: buffer.length }))
})
test("renvoie 404 pour un identifiant invalide", async ()=> {
  await expect(getMissionOrderUrl("abc", admin)).rejects.toThrow("Trajet introuvable")
})
test("renvoie 404 si le trajet n'existe pas", async ()=> {
  tripRepository.findByIdWithDetails.mockResolvedValue(null)
  await expect(getMissionOrderUrl(tripId, admin)).rejects.toThrow("Trajet introuvable")
})
test("renvoie 403 pour le chauffeur d'un autre trajet", async ()=> {
  tripRepository.findByIdWithDetails.mockResolvedValue(makeTrip())
  await expect(getMissionOrderUrl(tripId, { role: "driver", userId: "autre" })).rejects.toThrow("Accès refusé")
})
test("génère le PDF, l'envoie dans MinIO et renvoie l'URL pour un admin", async ()=> {
  const trip= makeTrip()
  tripRepository.findByIdWithDetails.mockResolvedValue(trip)
  const result= await getMissionOrderUrl(tripId, admin)
  const [key, buffer, contentType]= storageService.uploadFile.mock.calls[0]
  expect(key).toMatch(/^orders\/2026\/TRP-2026-[0-9A-F]{6}\.pdf$/)
  expect(buffer.slice(0, 4).toString()).toBe("%PDF")
  expect(contentType).toBe("application/pdf")
  expect(tripRepository.save).toHaveBeenCalledWith(trip)
  expect(trip.missionOrder.s3Key).toBe(key)
  expect(result).toEqual({ url: "http://signed-url", expiresInSeconds: 900 })
})
test("autorise le chauffeur assigné", async ()=> {
  tripRepository.findByIdWithDetails.mockResolvedValue(makeTrip())
  await expect(getMissionOrderUrl(tripId, driver)).resolves.toEqual({ url: "http://signed-url", expiresInSeconds: 900 })
})
test("réutilise le PDF déjà stocké sans le régénérer", async ()=> {
  tripRepository.findByIdWithDetails.mockResolvedValue(makeTrip({ missionOrder: { s3Key: "orders/2026/existant.pdf" } }))
  await getMissionOrderUrl(tripId, admin)
  expect(storageService.uploadFile).not.toHaveBeenCalled()
  expect(storageService.getDownloadUrl).toHaveBeenCalledWith("orders/2026/existant.pdf")
})