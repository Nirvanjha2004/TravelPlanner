const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Experience',
  },
  text: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);
