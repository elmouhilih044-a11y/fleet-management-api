const express= require("express")
const router= express.Router()
const tripController= require("../controllers/tripController")
const auth= require("../middlewares/auth")
const authorize= require("../middlewares/authorize")
const validate= require("../middlewares/validate")
const {updateStatusSchema}= require("../validators/tripValidator")

router.use(auth, authorize("driver"))

router.get("/", tripController.getMyTrips)
router.get("/:id", tripController.getMyTrip)
router.put("/:id/status", validate(updateStatusSchema), tripController.updateMyTripStatus)

module.exports= router