const mongoose = require('mongoose');

const crosswordSchema = new mongoose.Schema({
  correctWord: {
    type: String,
    required: true
  },
  initialLetters: {
    type: [String],
    required: true
  },
  hint: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Index for queries that sort by creation date
crosswordSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Crossword', crosswordSchema);
