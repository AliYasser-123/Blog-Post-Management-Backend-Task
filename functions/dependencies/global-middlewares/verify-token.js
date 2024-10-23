const { isTokenInvalid, decodeToken, compareToken } = require('../helpers/token');
const { getPromiseConnection, endPromiseConnection } = require('../config/config');


module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            const token = req.headers.accesstoken

            // Check if token exists
            if (!token) {
                await endPromiseConnection(getPromiseConnection())
                return res.status(401).send({ message: "Token is required", data: null })
            }

            // Check if deviceIdentifier exists
            if (!req.headers.deviceidentifier) {
                await endPromiseConnection(getPromiseConnection())
                return res.status(401).send({ message: "Device identifier is required", data: null })
            }

            // Check token
            const invalidToken = await isTokenInvalid(token, process.env.ACCESS_TOKEN_SECRET)

            // If token is expired
            if (invalidToken == 'TokenExpiredError') {
                await endPromiseConnection(getPromiseConnection())
                return res.status(401).send({ message: 'Access denied', data: null })
            }

            // If token is invalid
            if (invalidToken == 'JsonWebTokenError') {
                await endPromiseConnection(getPromiseConnection())
                return res.status(401).send({ message: 'Access denied', data: null })
            }

            // Extract token data
            const { adminId, deviceIdentifier, brandId } = await decodeToken(token)

            // Check if the token is stolen
            if (deviceIdentifier != req.headers.deviceidentifier) {
                await endPromiseConnection(getPromiseConnection())
                return res.status(401).send({ message: 'Access denied', data: null })
            }

            // Match the access token in database
            const tokenMatch = await compareToken(adminId, deviceIdentifier, token)
            if (!tokenMatch) {
                await endPromiseConnection(getPromiseConnection())
                return res.status(401).send({ message: 'Access denied', data: null })
            }

            // Add token data to request
            req.admin = { adminId, deviceIdentifier, brandId }

            next()

        } catch (err) {
            console.error(err)
            await endPromiseConnection(getPromiseConnection())
            return res.status(500).send({ message: 'Something went wrong', data: null })
        }
    }
}