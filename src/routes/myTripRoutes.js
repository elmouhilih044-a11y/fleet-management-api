const express= require("express")
const router= express.Router()
const tripController= require("../controllers/tripController")
const auth= require("../middlewares/auth")
const authorize= require("../middlewares/authorize")

router.use(auth, authorize("driver"))

router.get("/", tripController.getMyTrips)
router.get("/:id", tripController.getMyTrip)

module.exports= router