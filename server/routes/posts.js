import express from 'express';
import multer from 'multer';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Create a post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { caption, userId } = req.body;
    const image = req.file.path;
    const post = new Post({ user: userId, image, caption });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get feed (all posts, newest first)
router.get('/feed', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Unlike a post
router.post('/:id/unlike', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes = post.likes.filter(uid => uid.toString() !== req.body.userId);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Edit a post
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const update = { caption };
    if (req.file) update.image = req.file.path;
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Comment on a post
router.post('/:id/comment', async (req, res) => {
  try {
    const { userId, text } = req.body;
    const comment = new Comment({ post: req.params.id, user: userId, text });
    await comment.save();
    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Edit a comment
router.put('/:postId/comment/:commentId', async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, { text }, { new: true });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a comment
router.delete('/:postId/comment/:commentId', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    // Optionally remove from post.comments
    await Post.findByIdAndUpdate(req.params.postId, { $pull: { comments: req.params.commentId } });
    res.json({ msg: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all posts by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate('user', 'username avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username avatar').populate({
      path: 'comments',
      populate: { path: 'user', select: 'username avatar' }
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// --- Stories and Following Feed (stubs for future expansion) ---
// router.post('/story', ...) // To be implemented
// router.get('/stories', ...) // To be implemented
// router.get('/feed/following', ...) // To be implemented

export default router;
