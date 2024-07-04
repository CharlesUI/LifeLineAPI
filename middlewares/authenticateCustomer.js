const { UnAuthorizedError} = require("../errors/ErrorClass")
const jwt = require('jsonwebtoken')

const authenticateCustomer = (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnAuthorizedError('UnAuthorized Attempt')
    }


    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // req.user = { customerId: payload.customerId, email: payload.email }
        console.log("payload", payload)
        req.user = payload
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = authenticateCustomer