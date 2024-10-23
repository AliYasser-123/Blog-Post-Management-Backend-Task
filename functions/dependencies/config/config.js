const mysql = require("mysql2");

const startConnection = () => {
    _promiseConnection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
        namedPlaceholders: true,
        dateStrings: true,
        decimalNumbers: true,
        timezone: 'Z',

    }).promise();
}

/**
 * 
 * @returns {Connection}
 */
const getPromiseConnection = () => {
    return _promiseConnection
}

/**
 * 
 * @param {Connection} promiseConnection 
*/
const endPromiseConnection = async (promiseConnection) => {
    await promiseConnection.end()
}

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../../dzlbx-evnts-brandadmin-staging-firebase-adminsdk-1doq5-6854cf7584.json");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://dzlbx-evnts-brandadmin-staging-default-rtdb.firebaseio.com"
});

let _promiseConnection;
const saltRounds = 10
const frontendUrl = "http://localhost:4200"
const pageSize = 15
const db = firebaseAdmin.database();

module.exports = {
    saltRounds,
    frontendUrl,
    pageSize,
    db,
    startConnection,
    getPromiseConnection,
    endPromiseConnection
};
