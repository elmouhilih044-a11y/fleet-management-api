const Truck= require("../models/Truck")
const Trailer= require("../models/Trailer")
const Tire= require("../models/Tire")
const Trip= require("../models/Trip")
const HOUR= 3600000
const hours= (field)=> ({ $round: [{ $divide: [field, HOUR] }, 1] })
const overlap= (startField, endField, start, end)=> ({ $subtract: [{ $min: [endField, end] }, { $max: [startField, start] }] })
const tireHealthMatrix= async (criticalPercent, unitPrice)=> {
  const [result]= await Tire.aggregate([
    { $addFields: { wearPercent: { $cond: [{ $gt: ["$wearThreshold", 0] }, { $multiply: [{ $divide: [{ $subtract: ["$currentMileage", "$installationMileage"] }, "$wearThreshold"] }, 100] }, 0] } } },
    { $facet: {
      byWear: [
        { $bucket: { groupBy: "$wearPercent", boundaries: [0, 50, 75, 90, 100], default: "100+", output: { tires: { $sum: 1 } } } },
        { $project: { _id: 0, tires: 1, range: { $switch: { branches: [{ case: { $eq: ["$_id", 0] }, then: "0-50" }, { case: { $eq: ["$_id", 50] }, then: "50-75" }, { case: { $eq: ["$_id", 75] }, then: "75-90" }, { case: { $eq: ["$_id", 90] }, then: "90-100" }], default: "100+" } } } }
      ],
      byPosition: [
        { $group: { _id: "$position", tires: { $sum: 1 }, averageWear: { $avg: "$wearPercent" }, maxWear: { $max: "$wearPercent" } } },
        { $project: { _id: 0, position: "$_id", tires: 1, averageWear: { $round: ["$averageWear", 1] }, maxWear: { $round: ["$maxWear", 1] } } },
        { $sort: { averageWear: -1 } }
      ],
      budget: [
        { $match: { wearPercent: { $gte: criticalPercent } } },
        { $group: { _id: null, tiresToReplace: { $sum: 1 } } },
        { $project: { _id: 0, tiresToReplace: 1, estimatedBudget: { $multiply: ["$tiresToReplace", unitPrice] } } }
      ],
      trucksAtRisk: [
        { $match: { wearPercent: { $gte: criticalPercent } } },
        { $group: { _id: "$truck", criticalTires: { $sum: 1 } } },
        { $lookup: { from: "trucks", localField: "_id", foreignField: "_id", as: "truck" } },
        { $unwind: "$truck" },
        { $project: { _id: 0, truck: "$truck.registrationNumber", criticalTires: 1 } },
        { $sort: { criticalTires: -1 } }
      ]
    } }
  ])
  return { byWear: result.byWear, byPosition: result.byPosition, budget: result.budget[0] || { tiresToReplace: 0, estimatedBudget: 0 }, trucksAtRisk: result.trucksAtRisk }
}
const vehicleUtilization= async (Model, vehicleType, start, end)=> {
  const periodMs= end - start
  const ratio= { $cond: [{ $gt: [{ $add: ["$idleMs", "$maintenanceMs"] }, 0] }, { $round: [{ $divide: ["$missionMs", { $add: ["$idleMs", "$maintenanceMs"] }] }, 2] }, null] }
  const [result]= await Model.aggregate([
    { $lookup: { from: "trips", let: { id: "$_id" }, pipeline: [
      { $match: { $expr: { $eq: [`$${vehicleType}`, "$$id"] }, status: { $in: ["in_progress", "completed"] }, plannedStartDate: { $lt: end }, plannedEndDate: { $gt: start } } },
      { $group: { _id: null, ms: { $sum: overlap("$plannedStartDate", "$plannedEndDate", start, end) } } }
    ], as: "mission" } },
    { $lookup: { from: "maintenancealerts", let: { id: "$_id" }, pipeline: [
      { $match: { $expr: { $eq: ["$vehicle", "$$id"] }, vehicleType, createdAt: { $lt: end } } },
      { $addFields: { endAt: { $cond: [{ $eq: ["$status", "resolved"] }, "$updatedAt", end] } } },
      { $match: { endAt: { $gt: start } } },
      { $group: { _id: null, ms: { $sum: overlap("$createdAt", "$endAt", start, end) } } }
    ], as: "maintenance" } },
    { $addFields: { missionMs: { $ifNull: [{ $arrayElemAt: ["$mission.ms", 0] }, 0] }, maintenanceMs: { $ifNull: [{ $arrayElemAt: ["$maintenance.ms", 0] }, 0] } } },
    { $addFields: { idleMs: { $max: [0, { $subtract: [periodMs, { $add: ["$missionMs", "$maintenanceMs"] }] }] } } },
    { $facet: {
      vehicles: [
        { $project: { _id: 0, registrationNumber: 1, status: 1, missionHours: hours("$missionMs"), maintenanceHours: hours("$maintenanceMs"), idleHours: hours("$idleMs"), utilizationRate: { $round: [{ $multiply: [{ $divide: ["$missionMs", periodMs] }, 100] }, 1] }, utilizationRatio: ratio } },
        { $sort: { utilizationRate: -1 } }
      ],
      fleet: [
        { $group: { _id: null, vehicles: { $sum: 1 }, missionMs: { $sum: "$missionMs" }, maintenanceMs: { $sum: "$maintenanceMs" }, idleMs: { $sum: "$idleMs" } } },
        { $project: { _id: 0, vehicles: 1, missionHours: hours("$missionMs"), maintenanceHours: hours("$maintenanceMs"), idleHours: hours("$idleMs"), utilizationRate: { $round: [{ $multiply: [{ $divide: ["$missionMs", { $multiply: ["$vehicles", periodMs] }] }, 100] }, 1] }, utilizationRatio: ratio } }
      ]
    } }
  ])
  return { vehicles: result.vehicles, fleet: result.fleet[0] || null }
}
const truckUtilization= (start, end)=> vehicleUtilization(Truck, "truck", start, end)
const trailerUtilization= (start, end)=> vehicleUtilization(Trailer, "trailer", start, end)
const monthlyTrend= async (start, end)=> {
  return await Trip.aggregate([
    { $match: { status: { $in: ["in_progress", "completed"] }, plannedStartDate: { $gte: start, $lte: end } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$plannedStartDate" } }, trips: { $sum: 1 }, missionHours: { $sum: { $divide: [{ $subtract: ["$plannedEndDate", "$plannedStartDate"] }, HOUR] } } } },
    { $project: { _id: 0, month: "$_id", trips: 1, missionHours: { $round: ["$missionHours", 1] } } },
    { $sort: { month: 1 } }
  ])
}
module.exports= { tireHealthMatrix, truckUtilization, trailerUtilization, monthlyTrend }