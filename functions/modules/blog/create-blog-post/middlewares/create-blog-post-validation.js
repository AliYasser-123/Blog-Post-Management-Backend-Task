const Joi = require('joi');
const {
    getPromiseConnection,
    endPromiseConnection,
} = require('../../../../dependencies/config/config');
const {
    JoiOverriddenMessages,
} = require('../../../../dependencies/utils/joi-error-template');

module.exports = {
    addBlogPostValidation: async (req, res, next) => {
        try {
            console.log('ADD_BLOG_POST_VALIDATION_MIDDLEWARE');

            const schema = Joi.object({
                title: Joi.string().min(3).max(255).required().label('Title'),
                content: Joi.string().min(10).required().label('Content'),
                tags: Joi.array()
                    .items(Joi.string().max(50))
                    .optional()
                    .label('Tags'),
            });

            req.body = await schema.validateAsync(req.body, {
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
