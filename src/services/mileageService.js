const calcMileage= (startMileage, endMileage)=> {
  return endMileage - startMileage
}
const calcConsumption= (fuelConsumed, totalMileage)=> {
  if (totalMileage <= 0) return 0
  return Number(((fuelConsumed / totalMileage) * 100).toFixed(2))
}
module.exports= { 
    calcMileage, 
    calcConsumption
 }