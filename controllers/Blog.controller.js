const BlogPost = require("../models/Blog.model");

exports.newBlogPost = async (req, res) => {
    try {
        const { title, content, author, excerpt, image, tags, slug, status, metaDescription } = req.body;
        const Data = new BlogPost({ title, content, author, excerpt, image, tags, slug, status, metaDescription });
        await Data.save();
        res.status(200).send({ msg: "Blog post successfully created" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send({ msg: "Duplicate key error: A blog post with this slug already exists", error });
        } else {
            res.status(500).send({ msg: "Invalid data", error });
        }
    }
};

exports.getBlog = async (req, res) => {
    try {
        const data = await BlogPost.find();
        if (!data) {
            res.status(401).json({ msg: "data not found" });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getBlogPostBySlug = async (req, res) => {
    const { slug } = req.params;
  
    try {
        const blogPost = await BlogPost.findOne({ slug });
  
        if (!blogPost) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
  
        res.status(200).json(blogPost);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.updateBlogPostBySlug = async (req, res) => {
    const { slug } = req.params;
    const { title, content, author, excerpt, image, tags, status, metaDescription } = req.body;
  
    try {
        const updatedBlogPost = await BlogPost.findOneAndUpdate(
            { slug },
            { title, content, author, excerpt, image, tags, status, metaDescription, lastUpdated: Date.now() },
            { new: true, runValidators: true }
        );
  
        if (!updatedBlogPost) {
            return res.status(404).json({ msg: "Blog post not found" });
        }
  
        res.status(200).json({ msg: "Blog post updated successfully", updatedBlogPost });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.deleteBlogPostBySlug = async (req, res) => {
    const { slug } = req.params;
  
    try {
        const deletedBlogPost = await BlogPost.findOneAndDelete({ slug });
  
        if (!deletedBlogPost) {
            return res.status(404).json({ msg: "Blog post not found" });
        }
  
        res.status(200).json({ msg: "Blog post deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};




// Search blogs by title or tags
exports.searchBlogs = async (req, res) => {
    const { query } = req.params;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    try {
  
         // Constructing a case-insensitive regex pattern for the search query
         const searchPattern = new RegExp(query, 'i');
  
         // Querying blogs based on title or tags containing the search pattern
         const blogs = await BlogPost.find({
           $or: [
             { title: { $regex: searchPattern } },
             { tags: { $in: [query] } } 
           ]
         });
  
      if (blogs.length === 0) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
  
      res.json(blogs);
    } catch (error) {
      console.error('Error searching blogs:', error);
      res.status(500).json({ error: 'An error occurred while searching for blogs' });
    }
  };

  // Search blogs by tags
exports.searchBlogsByTags = async (req, res) => {
    const { query } = req.params;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    try {
      // Querying blogs based on tags containing the search query
      const blogs = await BlogPost.find({
        tags: { $in: [query] }
      });
  
      if (blogs.length === 0) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
  
      res.json(blogs);
    } catch (error) {
      console.error('Error searching blogs:', error);
      res.status(500).json({ error: 'An error occurred while searching for blogs' });
    }
  };
  