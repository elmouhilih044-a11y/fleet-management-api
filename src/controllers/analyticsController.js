const analyticsService= require("../services/analyticsService")
const getDriverEcoPerformance= async (req, res, next)=> {
  try {
    res.status(200).json(await analyticsService.getDriverEcoPerformance())
  } catch (error) {
    next(error)
  }
}
const getFinancialEsg= async (req, res, next)=> {
  try {
    res.status(200).json(await analyticsService.getFinancialEsg(req.query))
  } catch (error) {
    next(error)
  }
}
const getTireHealthMatrix= async (req, res, next)=> {
  try {
    res.status(200).json(await analyticsService.getTireHealthMatrix())
  } catch (error) {
    next(error)
  }
}
const getFleetUtilization= async (req, res, next)=> {
  try {
    res.status(200).json(await analyticsService.getFleetUtilization(req.query))
  } catch (error) {
    next(error)
  }
}
module.exports= { getDriverEcoPerformance, getFinancialEsg, getTireHealthMatrix, getFleetUtilization }