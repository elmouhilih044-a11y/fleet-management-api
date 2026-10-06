const express= require("express")
const router= express.Router()
const tripController= require("../controllers/tripController")
const auth= require("../middlewares/auth")
const authorize= require("../middlewares/authorize")
const validate= require("../middlewares/validate")
const { createTripSchema, updateTripSchema }= require("../validators/tripValidator")

router.use(auth, authorize("admin"))

router.get("/", tripController.getAllTrips)
router.get("/:id", tripController.getTripById)
router.post("/", validate(createTripSchema), tripController.createTrip)
router.put("/:id", validate(updateTripSchema), tripController.updateTrip)
router.delete("/:id", tripController.deleteTrip)

module.exports= router