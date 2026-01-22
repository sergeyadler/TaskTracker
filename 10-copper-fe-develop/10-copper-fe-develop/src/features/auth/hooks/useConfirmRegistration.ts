import { useEffect, useState } from "react";
import { confirmRegistration } from "../services/api";

export type ConfirmState = "idle" | "loading" | "ok" | "err";

export function useConfirmRegistration(code: string | null): ConfirmState {
    const [state, setState] = useState<ConfirmState>("idle");

    useEffect(() => {
        if (!code) { setState("err"); return; }
        let cancelled = false;
        setState("loading");
        confirmRegistration(code)
            .then(() => { if (!cancelled) setState("ok"); })
            .catch(() => { if (!cancelled) setState("err"); });
        return () => { cancelled = true; };
    }, [code]);

    return state;
}
