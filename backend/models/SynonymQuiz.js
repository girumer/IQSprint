const mongoose = require('mongoose');

const SynonymQuizSchema = new mongoose.Schema({
    question: { type: String, required: true },   // e.g., "Select the synonym of 'Rapid'"
    options: { type: [String], required: true },  // ["Slow", "Fast", "Weak", "Late"]
    answer: { type: Number, required: true },     // Correct index (0–3)
    explanation: { type: String, required: true }, // Why it's correct
    hint: { type: String } // optional
}, { timestamps: true });

// Index for queries that sort by creation date
SynonymQuizSchema.index({ createdAt: 1 });

module.exports = mongoose.model("SynonymQuiz", SynonymQuizSchema);
