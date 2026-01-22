type Toast = { id: number; type: "success" | "error" | "info"; message: string };
type ToastCtx = {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
};