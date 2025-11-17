import React, { useState } from 'react';
import axios from 'axios';

export default function TechQuizUploader({ backendBase = process.env.REACT_APP_BACKENDURL || '' }) {
    // 1. STATE DECLARATIONS: Replaced 'answer' with 'correctAnswerIndex'
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']); // Start with 4 empty options
    
    // ✅ CORRECTED: This defines the missing state variables and setters
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(''); 
    
    const [status, setStatus] = useState('');

    const handleOptionChange = (e, index) => {
        const updated = [...options];
        updated[index] = e.target.value;
        setOptions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        
        // Clean up empty options before sending
        const validOptions = options.filter(opt => opt.trim() !== '');
        
        // 2. VALIDATION: Check if an index is selected
        if (!question || validOptions.length < 2 || correctAnswerIndex === '') {
            setStatus('❌ Please fill in the question, select the correct option index, and provide at least two options.');
            return;
        }

        try {
            // Ensure the index is converted to a number for the server
            const correctIndex = parseInt(correctAnswerIndex, 10);

            await axios.post(`${backendBase}/api/tech-quiz/create`, {
                question,
                options: validOptions,
                // Sending the required field and data type
                correctAnswerIndex: correctIndex, 
            });
            
            setStatus('✅ Tech Quiz saved successfully!');
            
            // 3. CLEAR FORM FIELDS: Use the new state setter
            setQuestion('');
            setOptions(['', '', '', '']);
            setCorrectAnswerIndex(''); 
        } catch (err) {
            console.error("Tech Quiz Save Error:", err.response?.data || err.message);
            // Provide more detail on the error if available from the server
            const errorMsg = err.response?.data?.message || 'Failed to save Tech Quiz. Check server logs.';
            setStatus(`❌ ${errorMsg}`);
        }
    };

    return (
        <div className="tech-quiz-uploader">
            <h3>📝 Tech Quiz Uploader</h3>
            <form onSubmit={handleSubmit}>
                <label>Question:</label>
                <textarea 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)} 
                    placeholder="e.g. Which company developed React.js?" 
                    required 
                />

                <label>Options (at least 2):</label>
                {options.map((option, index) => (
                    <input
                        key={index}
                        value={option}
                        onChange={(e) => handleOptionChange(e, index)}
                        placeholder={`Option ${index + 1}`}
                    />
                ))}
                
                <label>Correct Answer Index:</label>
                <select
                    // 4. JSX BINDING: Use the new state variable and setter
                    value={correctAnswerIndex}
                    onChange={(e) => setCorrectAnswerIndex(e.target.value)}
                    required
                >
                    <option value="" disabled>Select the correct option index</option>
                    {options.filter(opt => opt.trim() !== '').map((opt, index) => (
                        <option key={index} value={index}>
                            {`${index + 1}: ${opt}`}
                        </option>
                    ))}
                </select>

                <div style={{ marginTop: 12 }}>
                    <button type="submit">Save Tech Quiz</button>
                </div>
            </form>
            {status && <p className="status">{status}</p>}
        </div>
    );
}