const Joi = require('joi');
const {
    getPromiseConnection,
    endPromiseConnection,
} = require('../../../../dependencies/config/config');
const {
    JoiOverriddenMessages,
} = require('../../../../dependencies/utils/joi-error-template');

module.exports = {
    getBlogPostValidation: async (req, res, next) => {
        try {

            const schema = Joi.object({
                id: Joi.number().integer().min(1).required().label('Post ID'),
            });

            req.params = await schema.validateAsync(req.params, {
                errors: { wrap: { label: false } },
                messages: JoiOverriddenMessages,
            });

            next();
        } catch (err) {
            if (err.details && err.details[0].message) {
                await endPromiseConnection(getPromiseConnection());
                return res
                    .status(400)
                    .send({ message: err.details[0].message, data: null });
            } else {
                await endPromiseConnection(getPromiseConnection());
                return res
                    .status(500)
                    .send({ message: 'Something went wrong', data: null });
            }
        }
    },
};
