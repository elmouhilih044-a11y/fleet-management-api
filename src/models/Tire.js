const mongoose= require('mongoose')

const tireSchema= new mongoose.Schema(
  {
    serialNumber:{
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    truck:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Truck',
      required: true
    },

    position:{
      type: String,
      required: true,
      trim: true
    },

    installationMileage:{
      type: Number,
      required: true,
      min: 0
    },

    currentMileage:{
      type: Number,
      required: true,
      min: 0
    },

    wearThreshold:{
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type:String,
      enum:['good', 'worn', 'to_replace'],
      default: 'good'
    }
  },
  {
    timestamps:true
  }
)

module.exports= mongoose.model('Tire', tireSchema)