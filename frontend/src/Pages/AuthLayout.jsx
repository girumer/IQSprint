import React from 'react';

const GAMES = ['Crossword', 'Sudoku', 'Tech quiz', 'Number sequence', 'Synonyms', 'Antonyms', 'Analogies'];

// Shared frame for the login and sign-up pages
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-hero-inner">
          <h2 className="tile-word" aria-label="IQsprint">
            {'IQSPRINT'.split('').map((ch, i) => (
              <span key={i} className={`tile ${i < 2 ? 'tile-gold' : ''}`} style={{ '--i': i }} aria-hidden="true">
                {ch}
              </span>
            ))}
          </h2>
          <p className="auth-tagline">Daily brain games. A few minutes a day, coins for every solve.</p>
          <ul className="auth-games">
            {GAMES.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </section>

      <main className="auth-panel">
        <div className="auth-card">
          <h1>{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
