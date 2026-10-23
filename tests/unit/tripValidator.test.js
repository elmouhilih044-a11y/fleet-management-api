const { createTripSchema, updateTripSchema }= require("../../src/validators/tripValidator")
const id= "507f1f77bcf86cd799439011"
const valid= { departureSite: "Youssoufia", arrivalSite: "Safi", goods: "Phosphate", plannedStartDate: "2026-11-01T08:00:00Z", plannedEndDate: "2026-11-02T08:00:00Z", driver: id, truck: id, trailer: id }
describe("createTripSchema", ()=> {
  test("accepte des données valides", ()=> {
    expect(createTripSchema.validate(valid).error).toBeUndefined()
  })
  test("refuse un site de départ manquant", ()=> {
    const { departureSite, ...data }= valid
    expect(createTripSchema.validate(data).error).toBeDefined()
  })
  test("refuse une date de fin avant la date de début", ()=> {
    expect(createTripSchema.validate({ ...valid, plannedEndDate: "2026-10-31T08:00:00Z" }).error).toBeDefined()
  })
  test("refuse un identifiant invalide", ()=> {
    expect(createTripSchema.validate({ ...valid, driver: "abc" }).error).toBeDefined()
  })
})
describe("updateTripSchema", ()=> {
  test("accepte une modification partielle", ()=> {
    expect(updateTripSchema.validate({ goods: "Sable" }).error).toBeUndefined()
  })
  test("refuse un corps vide", ()=> {
    expect(updateTripSchema.validate({}).error).toBeDefined()
  })
})