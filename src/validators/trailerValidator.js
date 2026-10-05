const Joi= require('joi')
const createTrailerSchema= Joi.object({
  registrationNumber: Joi.string().required(),
  type: Joi.string().required(),
  currentMileage: Joi.number().min(0).required()
})
const updateTrailerSchema= Joi.object({
  registrationNumber: Joi.string(),
  type: Joi.string(),
  currentMileage: Joi.number().min(0),
  status: Joi.string().valid('available', 'maintenance', 'inactive')
}).min(1);

module.exports= { 
    createTrailerSchema,
     updateTrailerSchema 
    }