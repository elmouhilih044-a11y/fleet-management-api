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

module.exports = mongoose.model(
  'MaintenanceAlert',
  maintenanceAlertSchema
)