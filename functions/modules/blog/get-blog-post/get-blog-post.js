const firebase = require('firebase-functions');
const express = require('express');

// Import the required dependencies
const {
    getPromiseConnection,
    endPromiseConnection,
} = require('../../../dependencies/config/config');
const {
    verifyToken,
} = require('../../../dependencies/global-middlewares/verify-token');
const {
    attachGlobalMiddlewares,
} = require('../../../dependencies/utils/add-middlewares');
const {
    getBlogPostValidation,
} = require('./middlewares/get-blog-post-validation');

// Initialize express app for Firebase function
const firebaseFunction = express();

// Attach global middlewares
attachGlobalMiddlewares(firebaseFunction);

// Define GET route for fetching a blog post by ID
firebaseFunction.get(
    '/blog/:id',
    verifyToken,
    getBlogPostValidation,
    async (req, res) => {
        try {
            console.log('GET_BLOG_POST_FUNCTION');

            // Extract blog post ID from request params (already validated by the middleware)
            const { id } = req.params;

            // Prepare SQL query to fetch the blog post from the database
            const query = `
            SELECT * FROM blog_posts
            WHERE id = ?
        `;

            // Get connection to MySQL database
            const connection = await getPromiseConnection();

            // Execute query to fetch the blog post
            const [rows] = await connection.query(query, [id]);

            // Close the database connection
            await endPromiseConnection(connection);

            // Check if the blog post exists
            if (rows.length === 0) {
                return res
                    .status(404)
                    .send({ message: 'Blog post not found', data: null });
            }

            // Send the blog post data in the response
            return res
                .status(200)
                .send({
                    message: 'Blog post retrieved successfully',
                    data: rows[0],
                });
        } catch (err) {
            console.error('Error retrieving blog post:', err);

            // Handle errors and close the connection
            await endPromiseConnection(getPromiseConnection());
            return res
                .status(500)
                .send({ message: 'Failed to retrieve blog post', data: null });
        }
    }
);

// Export Firebase HTTP function
module.exports = firebase.https.onRequest(firebaseFunction);
