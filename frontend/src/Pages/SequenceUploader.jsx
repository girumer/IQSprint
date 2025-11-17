import React, { useState } from 'react';
import axios from 'axios';
import './admin-uploaders.css';

export default function SequenceUploader({ backendBase = process.env.REACT_APP_BACKENDURL  || '' }) {
    // Stores the comma-separated string from the input
    const [sequenceInput, setSequenceInput] = useState(''); 
    // Stores the single correct number answer
    const [correctAnswer, setCorrectAnswer] = useState(''); 
    const [hint, setHint] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');

        // --- 1. Validation and Parsing ---
        
        // Convert comma-separated string to an array of numbers
        const sequenceArray = sequenceInput
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0) // Remove empty strings
            .map(s => parseInt(s, 10)); // Convert to integers

        // The correct answer must be a number
        const answerNumber = parseInt(correctAnswer.trim(), 10);

        if (sequenceArray.some(isNaN) || sequenceArray.length < 3) {
            setStatus('❌ Invalid sequence. Please enter at least 3 numbers separated by commas (e.g., 2, 4, 8).');
            return;
        }

        if (isNaN(answerNumber)) {
            setStatus('❌ Correct Answer must be a number.');
            return;
        }
        
        if (!hint.trim()) {
            setStatus('❌ Please provide a hint (e.g., "The common difference is 5").');
            return;
        }

        // --- 2. API Submission ---
        try {
            await axios.post(`${backendBase}/api/sequence/create`, {
                sequence: sequenceArray,
                correctAnswer: answerNumber,
                hint,
            });
            setStatus('✅ Number Sequence saved successfully!');
            // Clear form
            setSequenceInput('');
            setCorrectAnswer('');
            setHint('');
        } catch (err) {
            console.error(err);
            setStatus('❌ Failed to save number sequence.');
        }
    };

    return (
        <div className="sequence-uploader">
            <h3>Number Sequence Uploader</h3>
            <form onSubmit={handleSubmit}>
                
                <label>Sequence Numbers:</label>
                <textarea 
                    value={sequenceInput} 
                    onChange={(e) => setSequenceInput(e.target.value)} 
                    placeholder="Enter the sequence numbers, separated by commas (e.g., 2, 4, 8, 16)" 
                    required 
                />

                <label>Correct Answer (The next number in the series):</label>
                <input 
                    type="number"
                    value={correctAnswer} 
                    onChange={(e) => setCorrectAnswer(e.target.value)} 
                    placeholder="e.g. 32" 
                    required 
                />

                <label>Hint (Type or description of the pattern):</label>
                <textarea 
                    value={hint} 
                    onChange={(e) => setHint(e.target.value)} 
                    placeholder="e.g. Find the number added to the previous one..." 
                    required 
                />

                <div style={{ marginTop: 12 }}>
                    <button type="submit">Save Sequence Puzzle</button>
                </div>
            </form>
            {status && <p className="status">{status}</p>}
        </div>
    );
}