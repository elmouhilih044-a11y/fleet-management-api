const Joi= require('joi')

const createTireSchema= Joi.object({
  serialNumber: Joi.string().required(),
  truck: Joi.string().hex().length(24).required(),
  position: Joi.string().required(),
  installationMileage: Joi.number().min(0).required(),
  currentMileage: Joi.number().min(0).required(),
  wearThreshold: Joi.number().min(0).required()
})

const updateTireSchema= Joi.object({
  serialNumber: Joi.string(),
  truck: Joi.string().hex().length(24),
  position: Joi.string(),
  currentMileage: Joi.number().min(0),
  wearThreshold: Joi.number().min(0),
  status: Joi.string().valid('good', 'worn', 'to_replace')
}).min(1)

module.exports= { 
    createTireSchema,
     updateTireSchema 
    }