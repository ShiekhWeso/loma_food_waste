import React, { useEffect, useState } from "react";

const TOAST_ICONS = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info"
};

const TOAST_STYLES = {
  success: "bg-surface-container-lowest border-secondary/30 text-on-surface",
  error: "bg-surface-container-lowest border-primary/30 text-on-surface",
  warning: "bg-surface-container-lowest border-tertiary/30 text-on-surface",
  info: "bg-surface-container-lowest border-outline/20 text-on-surface"
};

const ICON_STYLES = {
  success: "text-secondary",
  error: "text-primary",
  warning: "text-tertiary",
  info: "text-outline"
};

function Toast({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 260);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.08)]
        min-w-[280px] max-w-[360px] cursor-pointer select-none
        ${TOAST_STYLES[toast.type] || TOAST_STYLES.info}
        ${exiting ? "toast-exit" : "toast-enter"}
      `}
      onClick={() => { setExiting(true); setTimeout(() => onRemove(toast.id), 260); }}
    >
      <span className={`material-symbols-outlined text-xl mt-0.5 shrink-0 fill ${ICON_STYLES[toast.type]}`}>
        {TOAST_ICONS[toast.type] || "info"}
      </span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-headline font-bold text-sm text-on-background mb-0.5">{toast.title}</p>
        )}
        <p className="text-xs text-on-surface-variant leading-snug">{toast.message}</p>
      </div>
      <button
        className="text-outline hover:text-on-surface transition-colors shrink-0 mt-0.5"
        onClick={(e) => { e.stopPropagation(); setExiting(true); setTimeout(() => onRemove(toast.id), 260); }}
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      className="fixed top-20 right-4 z-[200] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
