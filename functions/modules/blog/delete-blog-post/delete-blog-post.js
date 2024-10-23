const firebase = require('firebase-functions');
const express = require('express');

// Import required dependencies
const {
    getPromiseConnection,
    endPromiseConnection,
} = require('../../../dependencies/config/config');
const {
    verifyToken,
} = require('../../../dependencies/global-middlewares/verify-token');
const {
    roleMiddleware,
} = require('../../../dependencies/global-middlewares/role-middleware');
const {
    attachGlobalMiddlewares,
} = require('../../../dependencies/utils/add-middlewares');
const {
    deleteBlogPostValidation,
} = require('./middlewares/delete-blog-post-validation');

// Initialize express app for Firebase function
const firebaseFunction = express();

// Attach global middlewares
attachGlobalMiddlewares(firebaseFunction);

// Define DELETE route for deleting a blog post by ID
firebaseFunction.delete(
    '/blog/:id',
    verifyToken,
    roleMiddleware,
    deleteBlogPostValidation,
    async (req, res) => {
        try {
            console.log('DELETE_BLOG_POST_FUNCTION');

            // Extract the blog post ID from request params
            const { id } = req.params;

            // Prepare SQL query to delete the blog post from the database
            const query = `
            DELETE FROM blog_posts 
            WHERE id = ? AND authorId = ?
        `;

            // Get connection to MySQL database
            const connection = await getPromiseConnection();

            // Assume `req.user.id` contains the author ID (from `verifyToken`)
            const authorId = req.user.id;

            // Execute query to delete the blog post
            const [result] = await connection.query(query, [id, authorId]);

            // Close the database connection
            await endPromiseConnection(connection);

            // Check if any rows were affected (i.e., blog post existed and was deleted)
            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .send({
                        message: 'Blog post not found or not authorized',
                        data: null,
                    });
            }

            // Send a success response if deletion was successful
            return res
                .status(200)
                .send({
                    message: 'Blog post deleted successfully!',
                    data: null,
                });
        } catch (err) {
            console.error('Error deleting blog post:', err);

            // Handle errors and close the connection
            await endPromiseConnection(getPromiseConnection());
            return res
                .status(500)
                .send({ message: 'Failed to delete blog post', data: null });
        }
    }
);

// Export Firebase HTTP function
module.exports = firebase.https.onRequest(firebaseFunction);
