const apiVersion= (version, deprecated)=> (req, res, next)=> {
  res.set("X-API-Version", version)
  res.set("X-API-Deprecated", String(deprecated))
  if (deprecated) {
    res.set("Sunset", "Thu, 31 Dec 2026 23:59:59 GMT")
    res.set("Link", '</api/v2>; rel="successor-version"')
  }
  next()
}
module.exports= apiVersion