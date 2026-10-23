const PDFDocument= require("pdfkit")
const mongoose= require("mongoose")
const tripRepository= require("../repositories/tripRepository")
const storageService= require("./storageService")
const AppError= require("../utils/AppError")
const env= require("../config/env")
const formatDate= (date)=> new Date(date).toLocaleString("fr-FR")
const getYear= (trip)=> new Date(trip.plannedStartDate).getFullYear()
const getReference= (trip)=> `TRP-${getYear(trip)}-${String(trip._id).slice(-6).toUpperCase()}`
const buildPdf= (trip)=> new Promise((resolve, reject)=> {
  const doc= new PDFDocument({ margin: 50 })
  const chunks= []
  doc.on("data", (chunk)=> chunks.push(chunk))
  doc.on("end", ()=> resolve(Buffer.concat(chunks)))
  doc.on("error", reject)
  doc.fontSize(20).text("Ordre de mission", { align: "center" })
  doc.moveDown()
  doc.fontSize(12)
  doc.text(`Référence : ${getReference(trip)}`)
  doc.text(`Chauffeur : ${trip.driver.firstName} ${trip.driver.lastName}`)
  doc.text(`Camion : ${trip.truck.registrationNumber} (${trip.truck.brand} ${trip.truck.model})`)
  doc.text(`Remorque : ${trip.trailer.registrationNumber} (${trip.trailer.type})`)
  doc.text(`Site de départ : ${trip.departureSite}`)
  doc.text(`Site d'arrivée : ${trip.arrivalSite}`)
  doc.text(`Marchandise : ${trip.goods}`)
  doc.text(`Début prévu : ${formatDate(trip.plannedStartDate)}`)
  doc.text(`Fin prévue : ${formatDate(trip.plannedEndDate)}`)
  doc.end()
})
const getMissionOrderUrl= async (tripId, user)=> {
  if (!mongoose.isValidObjectId(tripId)) throw new AppError("Trajet introuvable", 404)
  const trip= await tripRepository.findByIdWithDetails(tripId)
  if (!trip) throw new AppError("Trajet introuvable", 404)
  if (user.role !== "admin" && String(trip.driver._id) !== String(user.userId)) throw new AppError("Accès refusé", 403)
  if (!trip.missionOrder || !trip.missionOrder.s3Key) {
    const key= `orders/${getYear(trip)}/${getReference(trip)}.pdf`
    trip.missionOrder= await storageService.uploadFile(key, await buildPdf(trip), "application/pdf")
    await tripRepository.save(trip)
  }
  const url= await storageService.getDownloadUrl(trip.missionOrder.s3Key)
  return { url, expiresInSeconds: env.minio.presignedTtl }
}
module.exports= { getMissionOrderUrl }