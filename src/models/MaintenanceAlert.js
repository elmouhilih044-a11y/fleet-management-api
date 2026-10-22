const mongoose= require('mongoose')

const maintenanceAlertSchema = new mongoose.Schema(
  {
    vehicleType:{
      type: String,
      enum:['truck', 'trailer', 'tire'],
      required: true
    },

    vehicle:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    maintenanceType:{
      type: String,
      enum:['oil_change', 'inspection', 'tire'],
      required: true
    },

    message:{
      type: String,
      required: true
    },
    
    mileage:{
      type: Number,
      required: true,
      min: 0
    },

    status:{
      type: String,
      enum:['pending', 'resolved'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
)
maintenanceAlertSchema.index({ vehicleType: 1, vehicle: 1, status: 1 })
module.exports = mongoose.model(
  'MaintenanceAlert',
  maintenanceAlertSchema
)