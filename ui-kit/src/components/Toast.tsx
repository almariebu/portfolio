import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastKind = "info" | "success" | "error";
type ToastItem = { id: number; message: string; kind: ToastKind };

type ToastContextValue = {
  show: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const kindStyles: Record<ToastKind, string> = {
  info: "bg-slate-900 text-white",
  success: "bg-green-800 text-white",
  error: "bg-red-800 text-white",
};

export function ToastProvider({
  children,
  duration = 4000,
}: {
  children: ReactNode;
  /** Milliseconds before a toast dismisses itself. */
  duration?: number;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, kind }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
    },
    [dismiss, duration],
  );

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach(clearTimeout);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed right-4 bottom-4 left-4 z-50 flex flex-col items-end gap-2 sm:left-auto"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex w-full max-w-sm items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm shadow-lg ${kindStyles[toast.kind]}`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(toast.id)}
              className="rounded px-1 font-bold focus-visible:outline-2 focus-visible:outline-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
