const PDFDocument= require("pdfkit")

const formatDate=(date)=> new Date(date).toLocaleString("fr-FR")

const generateMissionOrder=(trip, stream)=> {
  const doc= new PDFDocument({ margin: 50 })
  doc.pipe(stream)

  doc.fontSize(22).text("ORDRE DE MISSION", { align: "center" })
  doc.moveDown()
  doc.fontSize(11).text(`Référence : ${trip._id}`, { align: "center" })
  doc.moveDown(2)

  doc.fontSize(14).text("Chauffeur")
  doc.fontSize(12).text(`${trip.driver.firstName} ${trip.driver.lastName}`)
  doc.moveDown()

  doc.fontSize(14).text("Véhicules")
  doc.fontSize(12).text(`Camion : ${trip.truck.registrationNumber} (${trip.truck.brand} ${trip.truck.model})`)
  doc.text(`Remorque : ${trip.trailer.registrationNumber} (${trip.trailer.type})`)
  doc.moveDown()

  doc.fontSize(14).text("Trajet")
  doc.fontSize(12).text(`Départ : ${trip.departureSite}`)
  doc.text(`Arrivée : ${trip.arrivalSite}`)
  doc.text(`Marchandise : ${trip.goods}`)
  doc.text(`Début prévu : ${formatDate(trip.plannedStartDate)}`)
  doc.text(`Fin prévue : ${formatDate(trip.plannedEndDate)}`)

  doc.end()
}

module.exports= { generateMissionOrder }