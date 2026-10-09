const { calcMileage, calcConsumption }= require("../../src/services/mileageService")

describe("calcMileage", ()=> {
  test("calcule le kilométrage total d'un trajet", ()=> {
    expect(calcMileage(57000, 57500)).toBe(500)
  })
})

describe("calcConsumption", ()=> {
  test("calcule la consommation en litres pour 100 km", ()=> {
    expect(calcConsumption(120, 500)).toBe(24)
  })

  test("arrondit à 2 décimales", ()=> {
    expect(calcConsumption(100, 300)).toBe(33.33)
  })

  test("renvoie 0 si le kilométrage est nul", ()=> {
    expect(calcConsumption(120, 0)).toBe(0)
  })
})