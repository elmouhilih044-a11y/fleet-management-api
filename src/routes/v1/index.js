const express= require("express")
const router= express.Router()
router.use("/auth", require("../authRoutes"))
router.use("/users", require("../userRoutes"))
router.use("/trucks", require("../truckRoutes"))
router.use("/trailers", require("../trailerRoutes"))
router.use("/tires", require("../tireRoutes"))
router.use("/trips", require("../tripRoutes"))
module.exports= router