const express= require("express")
const router= express.Router()
const tireController= require("../controllers/tireController")
const auth= require("../middlewares/auth")
const authorize= require("../middlewares/authorize")
const validate= require("../middlewares/validate")
const { createTireSchema, updateTireSchema }= require("../validators/tireValidator")

router.use(auth, authorize("admin"))

router.get("/", tireController.getAllTires)
router.get("/:id", tireController.getTireById)
router.post("/", validate(createTireSchema), tireController.createTire)
router.put("/:id", validate(updateTireSchema), tireController.updateTire)
router.delete("/:id", tireController.deleteTire)

module.exports= router