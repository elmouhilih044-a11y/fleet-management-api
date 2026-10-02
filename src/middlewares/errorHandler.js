function errorHandler(err, req, res, next){
  const status= err.status || 500

  if (status === 500){
    console.error(err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }

  res.status(status).json({ message: err.message })
}

module.exports= errorHandler