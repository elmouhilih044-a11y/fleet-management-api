const Joi= require('joi')

const createRuleSchema= Joi.object({
  vehicleType: Joi.string().valid('truck', 'trailer').required(),
  maintenanceType: Joi.string().valid('oil_change', 'inspection', 'tire').required(),
  mileageInterval: Joi.number().integer().min(1).required(),
  isActive: Joi.boolean()
})

const updateRuleSchema= Joi.object({
  mileageInterval: Joi.number().integer().min(1),
  isActive: Joi.boolean()
}).min(1)

module.exports= { 
    createRuleSchema,
     updateRuleSchema 
    }