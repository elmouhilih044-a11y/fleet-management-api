const mongoose= require('mongoose');

const truckSchema= new mongoose.Schema(
  {
    registrationNumber:{
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    brand:{
      type: String,
      required: true,
      trim: true
    },

    model:{
      type: String,
      required: true,
      trim: true
    },

    currentMileage:{
      type: Number,
      required: true,
      min: 0
    },

    status:{
      type: String,
      enum:['available', 'maintenance', 'inactive'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

module.exports= mongoose.model('Truck', truckSchema);