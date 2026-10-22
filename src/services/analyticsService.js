const analyticsRepository= require("../repositories/analyticsRepository")
const fleetAnalyticsRepository= require("../repositories/fleetAnalyticsRepository")
const AppError= require("../utils/AppError")
const env= require("../config/env")
const BASE_CONSUMPTION= 30
const SCORE_PENALTY= 2.5
const CO2_KG_PER_LITER= 2.68
const CRITICAL_WEAR_PERCENT= 90
const DEFAULT_PERIOD_MS= 30 * 24 * 3600 * 1000
const toDate= (value)=> {
  const date= new Date(value)
  if (Number.isNaN(date.getTime())) throw new AppError("Date invalide", 400)
  return date
}
const getDriverEcoPerformance= async ()=> {
  return await analyticsRepository.driverEcoPerformance(BASE_CONSUMPTION, SCORE_PENALTY)
}
const getFinancialEsg= async (query)=> {
  const startDate= query.startDate ? toDate(query.startDate) : null
  const endDate= query.endDate ? toDate(query.endDate) : null
  if (startDate && endDate && endDate < startDate) throw new AppError("endDate doit être après startDate", 400)
  return await analyticsRepository.financialEsg(startDate, endDate, env.fuelPricePerLiter, CO2_KG_PER_LITER)
}
const getTireHealthMatrix= async ()=> {
  return await fleetAnalyticsRepository.tireHealthMatrix(CRITICAL_WEAR_PERCENT, env.tireUnitPrice)
}
const getFleetUtilization= async (query)=> {
  const endDate= query.endDate ? toDate(query.endDate) : new Date()
  const startDate= query.startDate ? toDate(query.startDate) : new Date(endDate.getTime() - DEFAULT_PERIOD_MS)
  if (endDate <= startDate) throw new AppError("endDate doit être après startDate", 400)
  const [trucks, trailers, monthlyTrend]= await Promise.all([
    fleetAnalyticsRepository.truckUtilization(startDate, endDate),
    fleetAnalyticsRepository.trailerUtilization(startDate, endDate),
    fleetAnalyticsRepository.monthlyTrend(startDate, endDate)
  ])
  return { period: { startDate, endDate }, trucks, trailers, monthlyTrend }
}
module.exports= { getDriverEcoPerformance, getFinancialEsg, getTireHealthMatrix, getFleetUtilization }