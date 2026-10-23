const mongoose= require('mongoose');

const tripSchema= new mongoose.Schema(
  {
    departureSite:{
      type: String,
      required: true,
      trim: true
    },

    arrivalSite:{
      type: String,
      required: true,
      trim: true
    },

    goods:{
      type: String,
      required: true,
      trim: true
    },

    plannedStartDate:{
      type: Date,
      required: true
    },

    plannedEndDate:{
      type: Date,
      required: true
    },

    driver:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    truck:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Truck',
      required: true
    },

    trailer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trailer',
      required: true
    },

    status:{
      type: String,
      enum:['todo', 'in_progress', 'completed'],
      default: 'todo'
    },

    startMileage:{
      type: Number,
      min: 0
    },

    endMileage:{
      type: Number,
      min: 0
    },

    fuelConsumed:{
      type: Number,
      min: 0
    },
    revenue:{
      type: Number,
      min: 0,
      default: 0
    },
        missionOrder:{
      bucket: String,
      s3Key: String,
      sizeBytes: Number
    },

    notes:{
      type: String,
      trim: true
    }
  },
  {
    timestamps:true
  }
)
tripSchema.index({ truck: 1, status: 1, plannedStartDate: 1, plannedEndDate: 1 })
tripSchema.index({ trailer: 1, status: 1, plannedStartDate: 1, plannedEndDate: 1 })
tripSchema.index({ driver: 1, status: 1, plannedStartDate: 1, plannedEndDate: 1 })

module.exports= mongoose.model('Trip', tripSchema)