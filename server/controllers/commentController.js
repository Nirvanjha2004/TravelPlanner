const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const Experience = require('../models/experienceModel');

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { text, experienceId } = req.body;

  // Check if experience exists
  const experience = await Experience.findById(experienceId);
  if (!experience) {
    res.status(404);
    throw new Error('Experience not found');
  }

  const comment = await Comment.create({
    user: req.user._id,
    experience: experienceId,
    text,
  });

  // Populate user details
  const populatedComment = await Comment.findById(comment._id).populate(
    'user',
    'name profilePicture'
  );

  if (comment) {
    res.status(201).json(populatedComment);
  } else {
    res.status(400);
    throw new Error('Invalid comment data');
  }
});

// @desc    Get comments for an experience
// @route   GET /api/comments/experience/:id
// @access  Public
const getCommentsByExperience = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ experience: req.params.id })
    .populate('user', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json(comments);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    // Check if user is the comment creator
    if (comment.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this comment');
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

module.exports = {
  createComment,
  getCommentsByExperience,
  deleteComment,
};
