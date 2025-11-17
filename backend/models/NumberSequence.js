const mongoose = require('mongoose');

const numberSequenceSchema = new mongoose.Schema({
    // The sequence of numbers shown to the user (e.g., [2, 4, 8, 16])
    sequence: {
        type: [Number], 
        required: true,
        validate: {
            // Ensure at least a few numbers are provided
            validator: (arr) => arr.length >= 3, 
            message: 'Sequence must have at least three numbers.'
        }
    },
    // The correct answer for the blank space
    correctAnswer: {
        type: Number,
        required: true
    },
    // The hint or the type of sequence (e.g., "Geometric Sequence")
    hint: {
        type: String,
        required: false // Hint is optional
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NumberSequence', numberSequenceSchema);