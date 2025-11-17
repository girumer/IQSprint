// models/TechQuiz.js (Your TechQuiz Model)
const mongoose = require('mongoose');
const techQuizSchema = new mongoose.Schema({
 question: {
 type: String,
 required: true,
 trim: true
 },
 options: {
 type: [String], // Array of strings for the multiple-choice options
 required: true,
 validate: {
validator: (arr) => arr.length >= 2, 
 message: 'Quiz must have at least two options'
 }
 },
 // 🛑 CRITICAL CHANGE: Store the correct index, not the string
 correctAnswerIndex: { 
 type: Number, 
 required: true,
 min: 0 
 },
 createdAt: {
 type: Date,
 default: Date.now
 }
});

module.exports = mongoose.model('TechQuiz', techQuizSchema);