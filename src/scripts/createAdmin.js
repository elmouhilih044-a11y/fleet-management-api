const bcrypt= require('bcrypt')
const connectDb= require('../config/db')
const User= require('../models/User')

async function createAdmin(){
  await connectDb()
  const existe= await User.findOne({ email:'admin@fleet.com'})
  if (existe){
    console.log('Admin déjà créé')
    process.exit()
  }

  const hash= await bcrypt.hash('Admin123', 10)

  await User.create({
    firstName:'Admin',
    lastName:'Fleet',
    email:'admin@fleet.com',
    password:hash,
    role:'admin'
  })
  console.log('Admin créé')
  process.exit()
}

createAdmin()