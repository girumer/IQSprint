import React, { useState } from 'react';

import SudokuAdminUploader from './SudokuAdminUploader';
import CrosswordUploader from './CrosswordUploader';
import './admin-uploaders.css';
import TechQuizUploader from './TechQuizUploader';
import SequenceUploader from './SequenceUploader';
import UploadSynonym from './UploadSynonym';
import AnalogyUploader from './AnalogyUploader';
import Antonyumuploader from './AntonymUploader';

export default function AdminDashboard() {
  const [type, setType] = useState('crossword'); // 'crossword' | 'sudoku'

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Content Manager</h1>
        <label htmlFor="uploader-select" style={{ marginLeft: 12 }}>Select uploader:</label>
        <select id="uploader-select" value={type} onChange={(e) => setType(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="crossword">Crossword</option>
          <option value="sudoku">Sudoku</option>
          <option value="tech">Tech Quiz</option>
          <option value="sequence">Number Sequence</option>
           <option value="analogy">Analogy</option>
            <option value="synonym">synonym</option>
            <option value="Antonyum">Antonyum</option>
        </select>
      </header>

      <main style={{ marginTop: 18 }}>
        {type === 'crossword' && <CrosswordUploader />}
        {type === 'sudoku' && <SudokuAdminUploader />}
        {type === 'tech' && <TechQuizUploader />}
        {type === 'sequence' && <SequenceUploader />}
        {type === 'analogy' && <AnalogyUploader />}
        {type === 'synonym' && <UploadSynonym/>}
         {type === 'Antonyum' && <Antonyumuploader/>}
      </main>
    </div>
  );
}
