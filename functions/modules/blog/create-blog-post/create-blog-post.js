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
    addBlogPostValidation,
} = require('./middlewares/create-blog-post-validation');

// Initialize express app for Firebase function
const firebaseFunction = express();

// Attach global middlewares
attachGlobalMiddlewares(firebaseFunction);

// Define POST route for creating a new blog post
firebaseFunction.post(
    '/blog',
    verifyToken,
    roleMiddleware,
    addBlogPostValidation,
    async (req, res) => {
        try {
            console.log('ADD_BLOG_POST_FUNCTION');

            // Extract the blog post data from request body
            const { title, content, tags } = req.body;

            // Prepare SQL query to insert the blog post into the database
            const query = `
            INSERT INTO blog_posts (title, content, tags, authorId, createdAt) 
            VALUES (?, ?, ?, ?, NOW())
        `;

            // Get connection to MySQL database
            const connection = await getPromiseConnection();

            // Assume `req.user.id` contains the author ID (from `verifyToken`)
            const authorId = req.user.id;

            // Execute query with the extracted values
            await connection.query(query, [
                title,
                content,
                JSON.stringify(tags || []),
                authorId,
            ]);

            // Close the database connection
            await endPromiseConnection(connection);

            // Send a success response
            return res
                .status(201)
                .send({
                    message: 'Blog post created successfully!',
                    data: null,
                });
        } catch (err) {
            console.error('Error creating blog post:', err);

            // Handle errors and close connection
            await endPromiseConnection(getPromiseConnection());
            return res
                .status(500)
                .send({ message: 'Failed to create blog post', data: null });
        }
    }
);

// Export Firebase HTTP function
module.exports = firebase.https.onRequest(firebaseFunction);
