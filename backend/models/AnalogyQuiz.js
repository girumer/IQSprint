const mongoose = require('mongoose');

const analogyQuizSchema = new mongoose.Schema({
  // Full analogy question (e.g., "Battery is to Flashlight as Fuel is to:")
  question: {
    type: String,
    required: true,
    trim: true,
  },

  // Multiple-choice options (A, B, C, D)
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length === 4,
      message: 'Analogy Quiz must have exactly four options.',
    },
  },

  // Correct answer index (0–3)
  answer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },

  // Explanation of the analogy
  explanation: {
    type: String,
    required: true,
    trim: true,
  },

  // Optional hint or category (e.g., "Function", "Part-to-Whole")
  hint: {
    type: String,
    trim: true,
    default: '',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AnalogyQuiz', analogyQuizSchema);
