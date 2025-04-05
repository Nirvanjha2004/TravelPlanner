const asyncHandler = require('express-async-handler');
const Experience = require('../models/experienceModel');

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { 'location.city': { $regex: req.query.keyword, $options: 'i' } },
          { 'location.country': { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};
    
  const count = await Experience.countDocuments({ ...keyword });
  const experiences = await Experience.find({ ...keyword })
    .populate('user', 'name profilePicture')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    experiences,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get experience by ID
// @route   GET /api/experiences/:id
// @access  Public
const getExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id)
    .populate('user', 'name profilePicture')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name profilePicture',
      },
    });

  if (experience) {
    res.json(experience);
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

// @desc    Create an experience
// @route   POST /api/experiences
// @access  Private
const createExperience = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    location, 
    images, 
    dateOfVisit, 
    categories,
    tips,
    budget,
    rating 
  } = req.body;

  const experience = await Experience.create({
    user: req.user._id,
    title,
    description,
    location,
    images: images || [],
    dateOfVisit,
    categories: categories || [],
    tips: tips || [],
    budget,
    rating,
  });

  if (experience) {
    res.status(201).json(experience);
  } else {
    res.status(400);
    throw new Error('Invalid experience data');
  }
});

// @desc    Update an experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (experience) {
    // Check if user is the experience creator
    if (experience.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this experience');
    }

    experience.title = req.body.title || experience.title;
    experience.description = req.body.description || experience.description;
    experience.location = req.body.location || experience.location;
    experience.images = req.body.images || experience.images;
    experience.dateOfVisit = req.body.dateOfVisit || experience.dateOfVisit;
    experience.categories = req.body.categories || experience.categories;
    experience.tips = req.body.tips || experience.tips;
    experience.budget = req.body.budget || experience.budget;
    experience.rating = req.body.rating || experience.rating;

    const updatedExperience = await experience.save();
    res.json(updatedExperience);
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

// @desc    Delete an experience
// @route   DELETE /api/experiences/:id
// @access  Private
const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (experience) {
    // Check if user is the experience creator
    if (experience.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this experience');
    }

    await experience.deleteOne();
    res.json({ message: 'Experience removed' });
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

// @desc    Like/Unlike an experience
// @route   PUT /api/experiences/:id/like
// @access  Private
const likeExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (experience) {
    // Check if the experience has already been liked by user
    const alreadyLiked = experience.likes.find(
      (like) => like.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike it
      experience.likes = experience.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like it
      experience.likes.push(req.user._id);
    }

    await experience.save();
    res.json({ likes: experience.likes });
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

module.exports = {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  likeExperience,
};
