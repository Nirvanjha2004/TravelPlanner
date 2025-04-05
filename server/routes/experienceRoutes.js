const express = require('express');
const router = express.Router();
const { 
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  likeExperience
} = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getExperiences);
router.get('/:id', getExperienceById);

// Protected routes
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);
router.put('/:id/like', protect, likeExperience);

module.exports = router;
