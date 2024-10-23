const joi = require('joi')
const { getPromiseConnection, endPromiseConnection } = require("../config/config");
const { JoiOverriddenMessages } = require('../utils/joi-error-template');

exports.validateHeaders = async (req, res, next) => {
    try {
        console.log('HEADERS_VALIDATION_MIDDLEWARE');

        const schema = joi.object({
            "content-type": joi.string().required().regex(/multipart\/form\-data/).messages({ 'string.pattern.base': 'Only multipart/form-data is accepted' })
        }).unknown(true);


        req.headers = await schema.validateAsync(req.headers, {
            errors: { wrap: { label: false } },
            messages: JoiOverriddenMessages,
        })

        next();
    }
    catch (err) {
        if (err.details && err.details[0].message) {
            await endPromiseConnection(getPromiseConnection())
            return res.status(400).send({ message: err.details[0].message, data: null })
        } else {
            await endPromiseConnection(getPromiseConnection())
            return res.status(500).send({ message: 'Something went wrong', data: null })
        }
    }
}