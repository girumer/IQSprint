import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import "./Toast.css";

const ToastContext = createContext(null);

const ICONS = { success: "✓", error: "!", info: "i", coin: "🪙" };

// Usage: const toast = useToast(); toast.success("Saved"); toast.error("Something failed");
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const api = useRef(null);
  if (!api.current) {
    api.current = {};
  }
  api.current.show = show;
  api.current.success = (m, d) => show(m, "success", d);
  api.current.error = (m, d) => show(m, "error", d ?? 5000);
  api.current.info = (m, d) => show(m, "info", d);
  api.current.coin = (m, d) => show(m, "coin", d ?? 4000);

  return (
    <ToastContext.Provider value={api.current}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon" aria-hidden="true">
              {ICONS[t.type]}
            </span>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}
