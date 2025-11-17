const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // optional: restrict to known roles
    default: 'user'
  },
  coins: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   solvedCrosswords: {
    type: [String],  // store crossword IDs like "crossword1", "crossword2"
    default: []
  },
  solvedTechQuizzes: { 
        type: [String], 
        default: []
    },
    solvedAnalogies: { 
 type: [String], 
 default: []
 },
 solvedAntonyms: {
        type: [String], 
        default: []
    },
    solvedSynonyms: {
    type: [String], 
    default: []
  },
  solvedSequences: { 
        type: [String], 
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);
