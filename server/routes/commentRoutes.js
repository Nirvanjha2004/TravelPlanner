const express = require('express');
const router = express.Router();
const { 
  createComment,
  getCommentsByExperience,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/experience/:id', getCommentsByExperience);

// Protected routes
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
