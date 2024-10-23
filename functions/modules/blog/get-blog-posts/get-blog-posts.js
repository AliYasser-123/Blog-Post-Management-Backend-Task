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
    listBlogPostsValidation,
} = require('./middlewares/list-blog-posts-validation');

// Initialize express app for Firebase function
const firebaseFunction = express();

// Attach global middlewares
attachGlobalMiddlewares(firebaseFunction);

// Define GET route for listing all blog posts
firebaseFunction.get(
    '/blogs',
    verifyToken,
    listBlogPostsValidation,
    async (req, res) => {
        try {

            // Get connection to the database
            const connection = await getPromiseConnection();

            // Query to select all blog posts along with the author's name and creation date
            const query = `
            SELECT 
                blog_posts.id, 
                blog_posts.title, 
                blog_posts.content, 
                blog_posts.created_at, 
                authors.name AS author_name
            FROM 
                blog_posts
            JOIN 
                authors ON blog_posts.author_id = authors.id
            ORDER BY 
                blog_posts.created_at DESC
        `;

            // Execute the query
            const [rows] = await connection.query(query);

            // Close the database connection
            await endPromiseConnection(connection);

            // Return the list of blog posts
            return res.status(200).send({
                message: 'Blog posts retrieved successfully',
                data: rows,
            });
        } catch (err) {
            console.error('Error retrieving blog posts:', err);

            // Handle errors and close the connection
            await endPromiseConnection(getPromiseConnection());
            return res.status(500).send({
                message: 'Failed to retrieve blog posts',
                data: null,
            });
        }
    }
);

// Export Firebase HTTP function
module.exports = firebase.https.onRequest(firebaseFunction);
