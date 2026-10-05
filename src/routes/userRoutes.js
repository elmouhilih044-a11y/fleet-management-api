const express= require("express")
const router= express.Router()
const userController= require("../controllers/userController")
const auth= require("../middlewares/auth")
const authorize= require("../middlewares/authorize")
const validate= require("../middlewares/validate")
const { createDriverSchema }= require("../validators/userValidator")

router.use(auth, authorize("admin"))

router.get("/drivers", userController.getAllDrivers)
router.post("/drivers", validate(createDriverSchema), userController.createDriver)
router.put("/drivers/:id/suspend", userController.suspendDriver)
router.put("/drivers/:id/activate", userController.activateDriver)

module.exports= router