const mongoose=require("mongoose");

const blogPostSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: false
    },
    datePublished: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft'
    },
    metaDescription: {
      type: String,
      required: false
    }
  });
  
  const BlogPost = mongoose.model('BlogPost', blogPostSchema);
  
  module.exports = BlogPost;