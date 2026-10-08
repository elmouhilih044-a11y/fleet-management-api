const express= require("express")
const authRoutes= require("./routes/authRoutes")
const userRoutes= require("./routes/userRoutes")
const truckRoutes= require("./routes/truckRoutes")
const trailerRoutes= require("./routes/trailerRoutes")
const tireRoutes= require("./routes/tireRoutes")
const tripRoutes=require("./routes/tripRoutes")
const myTripRoutes= require("./routes/myTripRoutes")
const maintenanceRoutes= require("./routes/maintenanceRoutes")
const errorHandler= require("./middlewares/errorHandler")

const app= express()
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/trucks", truckRoutes)
app.use("/api/trailers", trailerRoutes)
app.use("/api/tires", tireRoutes)
app.use("/api/trips", tripRoutes);
app.use("/api/my-trips", myTripRoutes)
app.use("/api/maintenance", maintenanceRoutes);
app.use(errorHandler)

module.exports= app