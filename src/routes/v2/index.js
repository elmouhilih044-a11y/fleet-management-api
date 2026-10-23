const express= require("express")
const router= express.Router()
router.use("/analytics", require("./analyticsRoutes"))
router.use("/trips", require("./tripRoutes"))
module.exports= router