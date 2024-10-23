const { startConnection } = require('../config/config');

module.exports = {
    createNewConnection: () => {
        return async (req, res, next) => {

            startConnection()

            next()
        }
    }
}