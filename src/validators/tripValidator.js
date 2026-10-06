const Joi= require('joi')

const id= Joi.string().hex().length(24)
const createTripSchema= Joi.object({
  departureSite: Joi.string().required(),
  arrivalSite: Joi.string().required(),
  goods: Joi.string().required(),
  plannedStartDate: Joi.date().iso().required(),
  plannedEndDate: Joi.date().iso().greater(Joi.ref('plannedStartDate')).required(),
  driver: id.required(),
  truck: id.required(),
  trailer: id.required()
})

const updateTripSchema= Joi.object({
  departureSite: Joi.string(),
  arrivalSite: Joi.string(),
  goods: Joi.string(),
  plannedStartDate: Joi.date().iso(),
  plannedEndDate: Joi.date().iso(),
  driver: id,
  truck: id,
  trailer: id
}).min(1)

module.exports= { 
    createTripSchema,
     updateTripSchema }