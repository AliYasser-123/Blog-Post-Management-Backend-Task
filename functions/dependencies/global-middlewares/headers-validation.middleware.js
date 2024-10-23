const joi = require('joi');
const {
    getPromiseConnection,
    endPromiseConnection,
} = require('../config/config');
const { JoiOverriddenMessages } = require('../utils/joi-error-template');

exports.validateHeaders = async (req, res, next) => {
    try {
        const schema = joi
            .object({
                'content-type': joi
                    .string()
                    .required()
                    .regex(/multipart\/form-data/)
                    .messages({
                        'string.pattern.base':
                            'Only multipart/form-data is accepted',
                    }),
            })
            .unknown(true); // Allow other headers to be present

        req.headers = await schema.validateAsync(req.headers, {
            errors: { wrap: { label: false } },
            messages: JoiOverriddenMessages,
        });

        next(); // Proceed to the next middleware if validation passes
    } catch (err) {
        await endPromiseConnection(getPromiseConnection());

        if (err.details && err.details[0].message) {
            return res
                .status(400)
                .send({ message: err.details[0].message, data: null });
        } else {
            return res
                .status(500)
                .send({ message: 'Something went wrong', data: null });
        }
    }
};
