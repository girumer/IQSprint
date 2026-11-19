import React, { useState } from "react";
import axios from "axios";
import { useToast } from "../components/Toast";
// 👈 Ensure you rename the CSS file too!

const AntonymUploader = ({ backendBase = process.env.REACT_APP_BACKENDURL || '' }) => {
    const toast = useToast();
  console.log("Backend URL:", backendBase);

  // State to hold the question/word
  const [word, setWord] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  // State to hold the CORRECT INDEX (0, 1, 2, or 3)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0); 
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    // Check required fields: word, 4 options, and explanation
    if (!word.trim() || options.some(opt => !opt.trim()) || !explanation.trim()) {
      toast.error("Fill in the word, all four options, and the explanation.");
      return;
    }

    const payload = {
      question: word.trim(),
      options: options.map(opt => opt.trim()),
      // 🎯 Sending the numeric index (0, 1, 2, or 3) as required by the backend
      answer: correctAnswerIndex, 
      hint: hint.trim() || undefined,
      explanation: explanation.trim(),
    };

    console.log("Submitting payload:", payload);

    try {
      // 🔑 The URL path is correct assuming you fixed the route path in your backend
      const response = await axios.post(`${backendBase}/api/antonym/create`, payload);
      toast.success("Antonym question saved.");
      console.log(response.data);

      // Reset form
      setWord("");
      setOptions(["", "", "", ""]);
      setCorrectAnswerIndex(0); // Reset index
      setHint("");
      setExplanation("");
    } catch (error) {
      console.error(error);
      toast.error(`Couldn’t save the antonym question: ${error.response?.data?.error || "Server error"}`);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Antonym Question</h2> {/* Corrected label */}

      <label>Main Word/Question:</label>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter the word to find the antonym for"
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
        placeholder="Explain why the selected option is the correct antonym"
      />

      <button onClick={handleSubmit}>Upload Antonym</button> {/* Corrected button label */}
    </div>
  );
};

export default AntonymUploader;