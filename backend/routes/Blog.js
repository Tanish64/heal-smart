import express from 'express';
import { body, validationResult } from 'express-validator';
import Blog from '../models/Blog.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Create a new blog
router.post(
  '/',
  authMiddleware,
  [
    body('title', 'Title is required').notEmpty(),
    body('content', 'Content is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, content } = req.body;
      const newBlog = new Blog({
        title,
        content,
        author: req.user.id,
      });
      await newBlog.save();
      res.status(201).json(newBlog);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like or unlike a blog
router.put('/like/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const userId = req.user.id;

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const liked = blog.likes.includes(userId);
    if (liked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Comment on a blog
router.post(
  '/comment/:id',
  authMiddleware,
  [body('text', 'Comment cannot be empty').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ error: 'Blog not found' });

      blog.comments.push({ text: req.body.text, commenter: req.user.id });
      await blog.save();
      res.json(blog);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete a blog
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
