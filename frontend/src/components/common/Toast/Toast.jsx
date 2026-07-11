import React, { useState, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

/* =============================================
   Toast Context + Hook
   ============================================= */
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

/* Individual Toast */
const Toast = ({ toast, onRemove }) => (
  <div className={`toast toast--${toast.type}`} role="alert">
    <span className="toast-icon">{ICONS[toast.type]}</span>
    <div className="toast-body">
      {toast.title && <div className="toast-title">{toast.title}</div>}
      {toast.message && <div className="toast-desc">{toast.message}</div>}
    </div>
    <button className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Dismiss">✕</button>
  </div>
);

/* Toast Provider */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title = '', message = '', duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
