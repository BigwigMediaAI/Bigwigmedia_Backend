const router = require("express").Router();
const { newBlogPost, getBlog, getBlogPostBySlug, updateBlogPostBySlug, deleteBlogPostBySlug,searchBlogs,searchBlogsByTags,postComment,getComments } = require("../../controllers/Blog.controller");

router.post("/add", newBlogPost);
router.get("/viewblog", getBlog);
router.get("/:slug", getBlogPostBySlug);
router.put('/:slug', updateBlogPostBySlug);
router.delete('/:slug', deleteBlogPostBySlug);
router.get('/search/:query', searchBlogs); 
router.get('/tags/:query', searchBlogsByTags); 
router.post('/:slug/comments', postComment);
router.get('/:slug/comments', getComments);
module.exports = router;
