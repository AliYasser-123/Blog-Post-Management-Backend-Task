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
    updateBlogPostValidation,
} = require('./middlewares/update-blog-post-validation');

// Initialize express app for Firebase function
const firebaseFunction = express();

// Attach global middlewares
attachGlobalMiddlewares(firebaseFunction);

// Define PUT route for updating a blog post
firebaseFunction.put(
    '/blog/:id',
    verifyToken,
    updateBlogPostValidation,
    async (req, res) => {
        try {
            console.log('UPDATE_BLOG_POST_FUNCTION');

            // Extract blog post ID from request params
            const { id } = req.params;

            // Get the updated fields from the request body (validated by middleware)
            const { title, content, tags } = req.body;

            // If no fields were provided for the update, return a bad request error
            if (!title && !content && !tags) {
                return res
                    .status(400)
                    .send({ message: 'No fields to update', data: null });
            }

            // Prepare SQL query for updating the blog post
            let query = 'UPDATE blog_posts SET ';
            const queryParams = [];

            if (title) {
                query += 'title = ?, ';
                queryParams.push(title);
            }
            if (content) {
                query += 'content = ?, ';
                queryParams.push(content);
            }
            if (tags) {
                query += 'tags = ?, ';
                queryParams.push(JSON.stringify(tags)); // Store tags as JSON string
            }

            // Remove the trailing comma and space
            query = query.slice(0, -2);
            query += ' WHERE id = ?';
            queryParams.push(id);

            // Get connection to MySQL database
            const connection = await getPromiseConnection();

            // Execute the update query
            const [result] = await connection.query(query, queryParams);

            // Close the database connection
            await endPromiseConnection(connection);

            // If no rows were affected, it means the blog post wasn't found
            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .send({ message: 'Blog post not found', data: null });
            }

            // Return success response
            return res
                .status(200)
                .send({
                    message: 'Blog post updated successfully',
                    data: null,
                });
        } catch (err) {
            console.error('Error updating blog post:', err);

            // Handle errors and close the connection
            await endPromiseConnection(getPromiseConnection());
            return res
                .status(500)
                .send({ message: 'Failed to update blog post', data: null });
        }
    }
);

// Export Firebase HTTP function
module.exports = firebase.https.onRequest(firebaseFunction);
