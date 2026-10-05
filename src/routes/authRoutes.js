const express= require("express")
const router= express.Router()
const authController= require("../controllers/authController")
const validate= require("../middlewares/validate")
const { loginSchema }= require("../validators/authValidator")

router.post("/login", validate(loginSchema), authController.login)

module.exports= router