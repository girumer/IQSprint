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

module.exports = mongoose.model('Crossword', crosswordSchema);
