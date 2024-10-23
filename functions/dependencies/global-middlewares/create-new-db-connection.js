const { startConnection } = require('../config/config');

module.exports = {
    createNewConnection: () => {
        return async (req, res, next) => {
            console.log('CREATE_NEW_DB_CONNECTION')

            startConnection()

            next()
        }
    }
}