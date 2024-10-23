const {
    getPromiseConnection,
    endPromiseConnection,
} = require('../../../../dependencies/config/config');

module.exports = {
    listBlogPostsValidation: async (req, res, next) => {
        try {

            // Here, you can add any query params or pagination validation later if needed.
            // Proceed to the next middleware or API logic
            next();
        } catch (err) {
            console.error('Error in LIST_BLOG_POSTS_VALIDATION:', err);
            await endPromiseConnection(getPromiseConnection());

            return res.status(500).send({
                message: 'Something went wrong during validation.',
                data: null,
            });
        }
    },
};
