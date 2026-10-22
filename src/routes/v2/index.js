const express= require("express")
const router= express.Router()
router.use("/analytics", require("./analyticsRoutes"))
module.exports= router