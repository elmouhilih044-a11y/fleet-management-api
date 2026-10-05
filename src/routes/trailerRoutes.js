const express= require("express")
const router= express.Router()
const trailerController= require("../controllers/trailerController")
const auth= require("../middlewares/auth")
const authorize= require("../middlewares/authorize")
const validate= require("../middlewares/validate")
const {createTrailerSchema, updateTrailerSchema}= require("../validators/trailerValidator")

router.use(auth, authorize("admin"))

router.get("/", trailerController.getAllTrailers)
router.get("/:id", trailerController.getTrailerById)
router.post("/", validate(createTrailerSchema), trailerController.createTrailer)
router.put("/:id", validate(updateTrailerSchema), trailerController.updateTrailer)
router.delete("/:id", trailerController.archiveTrailer)

module.exports= router