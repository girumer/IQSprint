const mongoose = require('mongoose');

// Renamed Schema variable to be correctly spelled
const AntonymQuizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: Number, required: true },
    explanation: { type: String, required: true },
    hint: { type: String }
}, { timestamps: true });

// Correctly export the model using the corrected Schema variable name
module.exports = mongoose.model("AntonymQuiz", AntonymQuizSchema);