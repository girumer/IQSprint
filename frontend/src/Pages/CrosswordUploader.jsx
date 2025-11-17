import React, { useState } from 'react';
import axios from 'axios';
import './admin-uploaders.css';

export default function CrosswordUploader({ backendBase = process.env.REACT_APP_BACKENDURL || '' }) {
  const [correctWord, setCorrectWord] = useState('');
  const [initialLetters, setInitialLetters] = useState([]);
  const [hint, setHint] = useState('');
  const [status, setStatus] = useState('');

  const handleWordChange = (e) => {
    const word = e.target.value.toUpperCase();
    setCorrectWord(word);
    setInitialLetters(Array(word.length).fill(''));
  };

  const handlePrefillChange = (e, index) => {
    const val = e.target.value.toUpperCase();
    if (/^[A-Z]?$/.test(val)) {
      const updated = [...initialLetters];
      updated[index] = val;
      setInitialLetters(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await axios.post(`${backendBase}/api/crossword/create`, {
        correctWord,
        initialLetters,
        hint,
      });
      setStatus('✅ Crossword saved successfully!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to save crossword.');
    }
  };

  return (
    <div className="crossword-uploader">
      <h3>Crossword Uploader</h3>
      <form onSubmit={handleSubmit}>
        <label>Correct Word:</label>
        <input value={correctWord} onChange={handleWordChange} placeholder="e.g. MOLECULE" required />

        <label>Hint (definition):</label>
        <textarea value={hint} onChange={(e) => setHint(e.target.value)} placeholder="e.g. A group of atoms bonded together..." required />

        <label>Prefill Letters:</label>
        <div className="prefill-grid">
          {initialLetters.map((letter, index) => (
            <input
              key={index}
              maxLength="1"
              value={letter}
              onChange={(e) => handlePrefillChange(e, index)}
              placeholder={correctWord[index] || ''}
              className="prefill-cell"
            />
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Save Crossword</button>
        </div>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
}
