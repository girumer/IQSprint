// src/components/Popup.js
import React, { useState, useEffect } from "react";
import "./Popup.css"; // We'll create this CSS file

const Popup = ({ show, onClose, message, autoClose = 0 }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  // Auto-close logic
  useEffect(() => {
    if (show && autoClose > 0) {
      const timer = setTimeout(() => handleClose(), autoClose);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300000); // wait for fade-out animation
  };

  if (!show && !visible) return null;

  return (
    <div className={`popup-overlay ${visible ? "show" : "hide"}`} onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <span className="popup-icon">🎉</span>
          <h2>Congratulations!</h2>
        </div>
        <div className="popup-body">
          <p>{message}</p>
        </div>
        <div className="popup-footer">
          <button className="popup-close-btn" onClick={handleClose}>
            Continue Playing
          </button>
        </div>
        <div className="popup-confetti">🎊</div>
      </div>
    </div>
  );
};

export default Popup;