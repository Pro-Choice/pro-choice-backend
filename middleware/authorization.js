const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = async(req, res, next) => {
    try {
        const jwtToken = req.header("token")
        console.log(jwtToken)
        if(!jwtToken) {
            return res.status(403).json("not authorized")
        }
        const payload = await jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user
    } catch (err) {
        console.error(err.message)
        return res.status(403).json("not authorized")
    }
    next()
}