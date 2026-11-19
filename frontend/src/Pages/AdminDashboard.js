import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SudokuAdminUploader from './SudokuAdminUploader';
import CrosswordUploader from './CrosswordUploader';
import TechQuizUploader from './TechQuizUploader';
import SequenceUploader from './SequenceUploader';
import UploadSynonym from './UploadSynonym';
import AntonymUploader from './Antonyumuploader';
import AnalogyUploader from './AnalogyUploader';
import { useAuth } from '../contexts/AuthContext';
import './admin-uploaders.css';

const TYPES = [
  { id: 'crossword', label: 'Crossword', icon: '🧩', Component: CrosswordUploader },
  { id: 'sudoku', label: 'Sudoku', icon: '🔢', Component: SudokuAdminUploader },
  { id: 'tech', label: 'Tech quiz', icon: '💡', Component: TechQuizUploader },
  { id: 'sequence', label: 'Sequence', icon: '🧠', Component: SequenceUploader },
  { id: 'synonym', label: 'Synonym', icon: '🔤', Component: UploadSynonym },
  { id: 'antonym', label: 'Antonym', icon: '🔡', Component: AntonymUploader },
  { id: 'analogy', label: 'Analogy', icon: '🔄', Component: AnalogyUploader },
];

export default function AdminDashboard() {
  const [type, setType] = useState('crossword');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const current = TYPES.find((t) => t.id === type);
  const Uploader = current.Component;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="wordmark">
          <span className="wordmark-tile">IQ</span>
          <span className="wordmark-text">sprint</span>
        </div>
        <span className="admin-badge">Admin</span>
        <button className="btn btn-ghost admin-logout" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <div className="admin-body">
        <h1>Add new puzzles</h1>
        <p className="admin-intro">Choose a game, fill in the form and save. Players see new puzzles right away.</p>

        <nav className="admin-types" aria-label="Puzzle type">
          {TYPES.map((t) => (
            <button
              key={t.id}
              className={`chip ${type === t.id ? 'active' : ''}`}
              onClick={() => setType(t.id)}
              aria-pressed={type === t.id}
            >
              <span aria-hidden="true">{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        <section className="admin-card" key={type}>
          <Uploader />
        </section>
      </div>
    </div>
  );
}
