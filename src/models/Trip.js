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

    notes:{
      type: String,
      trim: true
    }
  },
  {
    timestamps:true
  }
)

module.exports= mongoose.model('Trip', tripSchema)