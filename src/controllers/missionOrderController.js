const missionOrderService= require("../services/missionOrderService")
const getMissionOrderUrl= async (req, res, next)=> {
  try {
    res.status(200).json(await missionOrderService.getMissionOrderUrl(req.params.id, req.user))
  } catch (error) {
    next(error)
  }
}
module.exports= { getMissionOrderUrl }