const express= require("express")
const router= express.Router()
const missionOrderController= require("../../controllers/missionOrderController")
const auth= require("../../middlewares/auth")
router.get("/:id/mission-order-url", auth, missionOrderController.getMissionOrderUrl)
module.exports= router