const mongoose= require('mongoose');

const userSchema= new mongoose.Schema(
  {
    firstName:{
      type: String,
      required: true,
      trim: true
    },

    lastName:{
      type: String,
      required: true,
      trim: true
    },

    email:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password:{
      type: String,
      required: true
    },

    role:{
      type: String,
      enum:['admin', 'driver'],
      default:'driver'
    },

    status:{
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    }
  },
  {
    timestamps:true
  }
);

module.exports= mongoose.model('User', userSchema);