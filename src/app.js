const express= require("express")
const authRoutes= require("./routes/authRoutes")
const userRoutes= require("./routes/userRoutes")
const truckRoutes= require("./routes/truckRoutes")
const errorHandler= require("./middlewares/errorHandler")

const app= express()
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/trucks", truckRoutes)

app.use(errorHandler)

module.exports= app