const Joi = require('joi');
const {
    getPromiseConnection,
    endPromiseConnection,
} = require('../../../../dependencies/config/config');
const {
    JoiOverriddenMessages,
} = require('../../../../dependencies/utils/joi-error-template');

module.exports = {
    deleteBlogPostValidation: async (req, res, next) => {
        try {
            console.log('DELETE_BLOG_POST_VALIDATION_MIDDLEWARE');

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
                console.log(err);
                await endPromiseConnection(getPromiseConnection());
                return res
                    .status(500)
                    .send({ message: 'Something went wrong', data: null });
            }
        }
    },
};
