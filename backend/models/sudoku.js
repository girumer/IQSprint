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

// Index for queries that sort by creation date
sudokuSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Sudoku', sudokuSchema);
