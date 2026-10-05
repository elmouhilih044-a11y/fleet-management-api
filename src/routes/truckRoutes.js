const express= require("express")
const router= express.Router()
const truckController= require("../controllers/truckController")
const auth= require("../middlewares/auth")
const authorize= require("../middlewares/authorize")
const validate= require("../middlewares/validate")
const { createTruckSchema, updateTruckSchema }= require("../validators/truckValidator")

router.use(auth, authorize("admin"))

router.get("/", truckController.getAllTrucks)
router.get("/:id", truckController.getTruckById)
router.post("/", validate(createTruckSchema), truckController.createTruck)
router.put("/:id", validate(updateTruckSchema), truckController.updateTruck)
router.delete("/:id", truckController.archiveTruck)

module.exports= router