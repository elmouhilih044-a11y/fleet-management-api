const Joi= require('joi')

const createTruckSchema= Joi.object({
  registrationNumber: Joi.string().required(),
  brand: Joi.string().required(),
  model: Joi.string().required(),
  currentMileage: Joi.number().min(0).required()
})

const updateTruckSchema= Joi.object({
  registrationNumber: Joi.string(),
  brand: Joi.string(),
  model: Joi.string(),
  currentMileage: Joi.number().min(0),
  status: Joi.string().valid('available', 'maintenance', 'inactive')
}).min(1)

module.exports= { createTruckSchema, updateTruckSchema }