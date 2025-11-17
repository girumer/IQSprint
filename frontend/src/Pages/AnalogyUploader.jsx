import React, { useState } from 'react';
import axios from 'axios';

export default function AnalogyUploader({ backendBase = process.env.REACT_APP_BACKENDURL || '' }) {
    const [question, setQuestion] = useState(''); // 🆕 Single question field
    const [optionsInput, setOptionsInput] = useState(''); // Comma-separated options
    const [answerIndex, setAnswerIndex] = useState(''); // 🆕 Answer is an index (0, 1, 2, or 3)
    const [explanation, setExplanation] = useState(''); // 🆕 New explanation field
    const [hint, setHint] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');

        // 1. Prepare Options Array
        const optionsArray = optionsInput
            .split(',')
            .map(s => s.trim()) // Keep case sensitive for display, but often better to uppercase
            .filter(s => s.length > 0);

        // 2. Validation
        if (optionsArray.length !== 4) {
            setStatus('❌ Analogy Quiz must have exactly four options separated by commas.');
            return;
        }
        const parsedAnswer = parseInt(answerIndex);
        if (isNaN(parsedAnswer) || parsedAnswer < 0 || parsedAnswer > 3) {
            setStatus('❌ Answer must be an index (0, 1, 2, or 3).');
            return;
        }

        const payload = {
            question: question.trim(), // Send the full question
            options: optionsArray,
            answer: parsedAnswer, // Send the correct index
            explanation: explanation.trim(),
            hint: hint.trim(),
        };

        try {
            await axios.post(`${backendBase}/api/analogy/create`, payload);
            setStatus('✅ Analogy Quiz saved successfully!');
            
            // Clear form
            setQuestion(''); setOptionsInput(''); setAnswerIndex(''); 
            setExplanation(''); setHint('');
        } catch (err) {
            console.error('Upload error:', err.response?.data || err);
            setStatus('❌ Failed to save analogy quiz. Check console for details.');
        }
    };

    return (
        <div className="analogy-uploader">
            <h3>Analogy Quiz Uploader</h3>
            <form onSubmit={handleSubmit}>
                
                {/* 1. FULL QUESTION INPUT */}
                <label>Full Analogy Question:</label>
                <textarea 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)} 
                    placeholder="e.g., Battery is to Flashlight as Fuel is to:" 
                    required 
                    style={{ width: '100%', minHeight: '80px' }}
                />

                {/* 2. OPTIONS INPUT */}
                <label style={{ marginTop: '15px', display: 'block' }}>Options (Exactly 4, comma-separated):</label>
                <textarea 
                    value={optionsInput} 
                    onChange={(e) => setOptionsInput(e.target.value)} 
                    placeholder="e.g., Engine, Car, Gas Station, Oil" 
                    required 
                    style={{ width: '100%', minHeight: '60px' }}
                />

                {/* 3. CORRECT ANSWER INDEX */}
                <label style={{ marginTop: '15px', display: 'block' }}>Correct Answer Index (0=A, 1=B, 2=C, 3=D):</label>
                <input 
                    type="number" 
                    value={answerIndex} 
                    onChange={(e) => setAnswerIndex(e.target.value)} 
                    min="0" max="3" 
                    placeholder="e.g., 0 for 'Engine' if it's the first option" 
                    required 
                />

                {/* 4. EXPLANATION INPUT */}
                <label style={{ marginTop: '15px', display: 'block' }}>Explanation of Relationship:</label>
                <textarea 
                    value={explanation} 
                    onChange={(e) => setExplanation(e.target.value)} 
                    placeholder="e.g., A battery powers a flashlight; fuel powers an engine." 
                    required 
                    style={{ width: '100%', minHeight: '60px' }}
                />

                {/* 5. HINT INPUT (Optional) */}
                <label style={{ marginTop: '15px', display: 'block' }}>Hint (Optional):</label>
                <input 
                    type="text"
                    value={hint} 
                    onChange={(e) => setHint(e.target.value)} 
                    placeholder="e.g., Power Source to Device" 
                    style={{ width: '100%' }}
                />

                <div style={{ marginTop: 15 }}>
                    <button type="submit">Save Analogy Quiz</button>
                </div>
            </form>
            {status && <p className="status" style={{ marginTop: '10px' }}>{status}</p>}
        </div>
    );
}