const createBlog = require('./modules/blog/create-blog-post');
const deleteBlog = require('./modules/blog/delete-blog-post');
const updateBlog = require('./modules/blog/update-blog-post');
const getBlogs = require('./modules/blog/get-blog-posts');
const getBlog = require('./modules/blog/get-blog-post');

module.exports = {
    createBlog,
    deleteBlog,
    updateBlog,
    getBlogs,
    getBlog,
};
