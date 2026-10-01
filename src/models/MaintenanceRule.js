const mongoose= require('mongoose');

const maintenanceRuleSchema= new mongoose.Schema(
  {
    vehicleType:{
      type: String,
      enum:['truck', 'trailer'],
      required: true
    },

    maintenanceType:{
      type: String,
      enum:['oil_change', 'inspection', 'tire'],
      required: true
    },

    mileageInterval:{
      type: Number,
      required: true,
      min: 1
    },

    isActive:{
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)
module.exports= mongoose.model(
  'MaintenanceRule',
  maintenanceRuleSchema
)