const User = require("../models/User");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt")

const getAllDrivers= async()=>{
    return await User.find({role:"driver" }).select("-password")
};


const createDriver= async(data)=>{
    const {firstName,lastName,email,password}= data

    const existingUser= await User.findOne({ email: email.toLowerCase()})

    if (existingUser) {
        throw new AppError("Cet email est déjà utilisé", 409);
    }
    const hashedPassword= await bcrypt.hash(password, 10)

    const driver= await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role:"driver"
    })

    driver.password= undefined;

    return driver;
}
const changeStatus= async (id, status) =>{
    const driver= await User.findById(id);

    if (!driver || driver.role !== "driver"){
        throw new AppError("Chauffeur introuvable", 404);
    }
    driver.status= status
    await driver.save()

    driver.password= undefined

    return driver
}

module.exports = {
    getAllDrivers,
    createDriver,
    changeStatus
}