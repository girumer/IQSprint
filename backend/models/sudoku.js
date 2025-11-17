const mongoose = require('mongoose');

const sudokuSchema = new mongoose.Schema({
  puzzle: {
    type: [[Number]],
    required: true
  },
  solution: {
    type: [[Number]],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sudoku', sudokuSchema);
