import React, { useState } from 'react';
import axios from 'axios';
import './sudko.css';

const blankGrid = Array.from({ length: 9 }, () => Array(9).fill(0));

export default function SudokuAdminUploader({ backendBase = process.env.REACT_APP_BACKENDURL || '' }) {
  const [puzzle, setPuzzle] = useState(blankGrid);
  const [solution, setSolution] = useState(blankGrid);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  function updateCell(gridSetter, r, c, raw) {
    const v = raw.replace(/[^0-9]/g, '').slice(0, 1);
    const num = v === '' ? 0 : parseInt(v, 10);
    gridSetter(prev => {
      const copy = prev.map(row => row.slice());
      copy[r][c] = num;
      return copy;
    });
  }

  async function handleUpload(e) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    setLoading(true);
    try {
      const payload = { puzzle, solution };
      const res = await axios.post(`${backendBase}/api/dashboard/upload-sudoku`, payload);
      setMsg(res.data.msg || 'Uploaded successfully');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }
function handleClear() {
  setPuzzle(blankGrid.map(row => row.slice()));
  setSolution(blankGrid.map(row => row.slice()));
  setMsg(null);
  setError(null);
}

  function renderGrid(grid, setter, label) {
    return (
      <div style={{ marginBottom: 16 }}>
        <h4>{label}</h4>
        <div className="sudoku-grid uploader-grid">
          {grid.flat().map((val, i) => {
            const r = Math.floor(i / 9);
            const c = i % 9;
            return (
              <input
                key={`${r}-${c}`}
               value={val === 0 ? '' : String(val)}
                onChange={e => updateCell(setter, r, c, e.target.value)}
                maxLength={1}
                inputMode="numeric"
                className="sudoku-cell"
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="sudoku-admin-uploader">
      <h3>Manual Sudoku Uploader</h3>
      <form onSubmit={handleUpload}>
        {renderGrid(puzzle, setPuzzle, 'Puzzle (with blanks)')}
        {renderGrid(solution, setSolution, 'Solution (fully filled)')}

        <div className="uploader-actions" style={{ marginTop: 12 }}>
          <button type="button" onClick={() => setPreviewMode(pm => !pm)} className="btn">
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button type="button" onClick={handleClear} className="btn" style={{ marginLeft: 8 }}>
  Clear All
</button>

          <button type="submit" disabled={loading} className="btn primary" style={{ marginLeft: 8 }}>
            {loading ? 'Uploading...' : 'Upload to Database'}
          </button>
        </div>

        {previewMode && (
          <div className="preview" style={{ marginTop: 12 }}>
            <h4>Preview</h4>
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <strong>Puzzle</strong>
                <div className="sudoku-grid preview-grid">
                  {puzzle.flat().map((v,i)=>(<div key={i} className="preview-cell">{v===0?'·':v}</div>))}
                </div>
              </div>
              <div>
                <strong>Solution</strong>
                <div className="sudoku-grid preview-grid">
                  {solution.flat().map((v,i)=>(<div key={i} className="preview-cell">{v===0?'·':v}</div>))}
                </div>
              </div>
            </div>
          </div>
        )}

        {msg && <div className="success" style={{ marginTop: 8 }}>{msg}</div>}
        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
