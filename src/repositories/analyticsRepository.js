const Trip= require("../models/Trip")
const driverEcoPerformance= async (baseConsumption, penalty)=> {
  const [result]= await Trip.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$driver", trips: { $sum: 1 }, totalFuel: { $sum: "$fuelConsumed" }, totalDistance: { $sum: { $subtract: ["$endMileage", "$startMileage"] } } } },
    { $match: { totalDistance: { $gt: 0 } } },
    { $addFields: { avgConsumption: { $multiply: [{ $divide: ["$totalFuel", "$totalDistance"] }, 100] } } },
    { $addFields: { score: { $max: [0, { $min: [100, { $subtract: [100, { $multiply: [{ $subtract: ["$avgConsumption", baseConsumption] }, penalty] }] }] }] } } },
    { $facet: {
      drivers: [
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "driver" } },
        { $unwind: "$driver" },
        { $project: { _id: 0, driverId: "$_id", firstName: "$driver.firstName", lastName: "$driver.lastName", trips: 1, totalDistance: 1, totalFuel: 1, avgConsumption: { $round: ["$avgConsumption", 2] }, score: { $round: ["$score", 1] } } },
        { $sort: { score: -1 } }
      ],
      summary: [
        { $group: { _id: null, driversCount: { $sum: 1 }, averageScore: { $avg: "$score" } } },
        { $project: { _id: 0, driversCount: 1, averageScore: { $round: ["$averageScore", 1] } } }
      ]
    } }
  ])
  return { drivers: result.drivers, summary: result.summary[0] || { driversCount: 0, averageScore: null } }
}
const financialEsg= async (startDate, endDate, fuelPrice, co2PerLiter)=> {
  const match= { status: "completed" }
  if (startDate || endDate) {
    match.plannedStartDate= {}
    if (startDate) match.plannedStartDate.$gte= startDate
    if (endDate) match.plannedStartDate.$lte= endDate
  }
  const [result]= await Trip.aggregate([
    { $match: match },
    { $group: { _id: { from: "$departureSite", to: "$arrivalSite" }, trips: { $sum: 1 }, totalFuel: { $sum: "$fuelConsumed" }, totalDistance: { $sum: { $subtract: ["$endMileage", "$startMileage"] } }, revenue: { $sum: { $ifNull: ["$revenue", 0] } } } },
    { $addFields: { fuelCost: { $multiply: ["$totalFuel", fuelPrice] }, co2Tonnes: { $divide: [{ $multiply: ["$totalFuel", co2PerLiter] }, 1000] } } },
    { $addFields: { grossMargin: { $subtract: ["$revenue", "$fuelCost"] } } },
    { $facet: {
      lines: [
        { $project: { _id: 0, from: "$_id.from", to: "$_id.to", trips: 1, totalDistance: 1, totalFuel: 1, revenue: 1, fuelCost: { $round: ["$fuelCost", 2] }, grossMargin: { $round: ["$grossMargin", 2] }, co2Tonnes: { $round: ["$co2Tonnes", 3] } } },
        { $sort: { grossMargin: -1 } }
      ],
      totals: [
        { $group: { _id: null, trips: { $sum: "$trips" }, totalFuel: { $sum: "$totalFuel" }, revenue: { $sum: "$revenue" }, fuelCost: { $sum: "$fuelCost" }, grossMargin: { $sum: "$grossMargin" }, co2Tonnes: { $sum: "$co2Tonnes" } } },
        { $project: { _id: 0, trips: 1, totalFuel: 1, revenue: 1, fuelCost: { $round: ["$fuelCost", 2] }, grossMargin: { $round: ["$grossMargin", 2] }, co2Tonnes: { $round: ["$co2Tonnes", 3] } } }
      ]
    } }
  ])
  return { lines: result.lines, totals: result.totals[0] || null }
}
module.exports= { driverEcoPerformance, financialEsg }