const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')
const User= require('../models/User')
const AppError= require('../utils/AppError')
async function login(email, password){
  const user= await User.findOne({ email });

  if (!user){
    throw new AppError('Email ou mot de passe incorrect',401);
  }

  if(user.status === 'suspended'){
    throw new AppError('Compte suspendu',403);
  }

  const passwordCorrect= await bcrypt.compare(password, user.password)

  if(!passwordCorrect){
    throw new AppError('Email ou mot de passe incorrect',401);
  }

  const token= jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  return{
    token,
    user:{
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  }
}

module.exports= {
  login
};