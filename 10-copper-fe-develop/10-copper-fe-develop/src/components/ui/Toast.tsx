import {useState, useCallback, type ReactNode} from "react";
import {ToastContext} from "./utils/useToast.ts";

export function ToastProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Toast[]>([]);

    const push = useCallback((type: Toast["type"], message: string) => {
        const id = Date.now() + Math.random();
        setItems((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3000);
    }, []);

    const showSuccess = useCallback((m: string) => push("success", m), [push]);
    const showError   = useCallback((m: string) => push("error", m), [push]);
    const showInfo    = useCallback((m: string) => push("info", m), [push]);

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {items.map((t) => (
                    <div
                        key={t.id}
                        className={
                            "min-w-[280px] rounded-lg px-4 py-3 shadow-lg text-sm text-white " +
                            (t.type === "success"
                                ? "bg-emerald-600"
                                : t.type === "error"
                                    ? "bg-rose-600"
                                    : "bg-zinc-800")
                        }
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}


