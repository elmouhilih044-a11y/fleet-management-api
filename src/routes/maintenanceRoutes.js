const express= require("express")
const router= express.Router()
const maintenanceController= require("../controllers/maintenanceController")
const auth= require("../middlewares/auth")
const authorize= require("../middlewares/authorize")
const validate= require("../middlewares/validate")
const { createRuleSchema, updateRuleSchema }= require("../validators/maintenanceValidator")

router.use(auth, authorize("admin"))

router.get("/rules", maintenanceController.getAllRules)
router.post("/rules", validate(createRuleSchema), maintenanceController.createRule)
router.put("/rules/:id", validate(updateRuleSchema), maintenanceController.updateRule)
router.delete("/rules/:id", maintenanceController.deleteRule)

module.exports= router