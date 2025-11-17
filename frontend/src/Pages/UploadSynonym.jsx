import React, { useState } from "react";
import axios from "axios";


const UploadSynonym = ({ backendBase = process.env.REACT_APP_BACKENDURL || '' }) => {
    console.log("Backend URL:", backendBase);

    const [word, setWord] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    // 🎯 CHANGED: Use index (number) instead of text (string)
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0); 
    const [hint, setHint] = useState("");
    const [explanation, setExplanation] = useState("");

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        // Validate required fields (word, 4 options, explanation)
        if (!word.trim() || options.some(opt => !opt.trim()) || !explanation.trim()) {
            alert("Please fill out the word, all four options, and the explanation.");
            return;
        }

        const payload = {
            question: word.trim(),
            options: options.map(opt => opt.trim()),
            // 🎯 FIXED: Sending the numeric index (0, 1, 2, or 3)
            answer: correctAnswerIndex, 
            hint: hint.trim() || undefined,
            explanation: explanation.trim(),
        };

        console.log("Submitting payload:", payload);

        try {
            const response = await axios.post(`${backendBase}/api/synonym/create`, payload);
            alert("Synonym question uploaded successfully!");
            console.log(response.data);

            // Reset form
            setWord("");
            setOptions(["", "", "", ""]);
            setCorrectAnswerIndex(0); // Reset index
            setHint("");
            setExplanation("");
        } catch (error) {
            console.error(error);
            alert(`Error uploading synonym question: ${error.response?.data?.error || "Server error"}`);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload Synonym Question</h2>

            <label>Word:</label>
            <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Enter the main word"
            />

            <label>Options:</label>
            {options.map((option, index) => (
                <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                />
            ))}

            <label>Correct Answer Index (0-3):</label>
            {/* 🎯 FIXED: Using a <select> to get the numeric index */}
            <select
                value={correctAnswerIndex}
                onChange={(e) => setCorrectAnswerIndex(parseInt(e.target.value))}
            >
                <option value={0}>Option 1 (Index 0)</option>
                <option value={1}>Option 2 (Index 1)</option>
                <option value={2}>Option 3 (Index 2)</option>
                <option value={3}>Option 4 (Index 3)</option>
            </select>
            {/* Removed the old text input for correctAnswer */}

            <label>Hint (optional):</label>
            <input
                type="text"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Small hint"
            />

            <label>Explanation:</label>
            <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why it is correct"
            />

            <button onClick={handleSubmit}>Upload Synonym</button>
        </div>
    );
};

export default UploadSynonym;