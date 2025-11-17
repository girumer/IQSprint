import React, { useState } from "react";
import axios from "axios";
 // Ensure you create this CSS file

const SynonymUploader = ({ backendBase = process.env.REACT_APP_BACKENDURL || '' }) => {

  const [word, setWord] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  // State to hold the CORRECT INDEX (0, 1, 2, or 3)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0); 
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    setMessage("");
    if (!word.trim() || options.some(opt => !opt.trim()) || !explanation.trim()) {
      setMessage("Please fill out the word, all four options, and the explanation.");
      return;
    }

    const payload = {
      question: word.trim(),
      options: options.map(opt => opt.trim()),
      // Sending the numeric index (0, 1, 2, or 3)
      answer: correctAnswerIndex, 
      hint: hint.trim() || undefined,
      explanation: explanation.trim(),
    };

    try {
      // 🔑 Targetting the correct backend route: /api/synonym/create
      const response = await axios.post(`${backendBase}/api/synonym/create`, payload);
      setMessage("✅ Synonym question uploaded successfully!");
      
      // Reset form
      setWord("");
      setOptions(["", "", "", ""]);
      setCorrectAnswerIndex(0); 
      setHint("");
      setExplanation("");

    } catch (error) {
      console.error("Synonym Upload Error:", error);
      setMessage(`❌ Error uploading Synonym question: ${error.response?.data?.error || "Server error"}`);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Synonym Question</h2>

      <label>Main Word/Question:</label>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter the word to find the synonym for"
      />

      <label>Options (4 total):</label>
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
      <select
        value={correctAnswerIndex}
        onChange={(e) => setCorrectAnswerIndex(parseInt(e.target.value))}
      >
        <option value={0}>Option 1 (Index 0)</option>
        <option value={1}>Option 2 (Index 1)</option>
        <option value={2}>Option 3 (Index 2)</option>
        <option value={3}>Option 4 (Index 3)</option>
      </select>

      <label>Hint (optional):</label>
      <input
        type="text"
        value={hint}
        onChange={(e) => setHint(e.target.value)}
        placeholder="Small hint related to the word"
      />

      <label>Explanation:</label>
      <textarea
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="Explain why the selected option is the correct synonym"
      />
      
      <button onClick={handleSubmit}>Upload Synonym</button>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
};

export default SynonymUploader;