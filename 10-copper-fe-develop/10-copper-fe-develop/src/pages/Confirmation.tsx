import {useNavigate, useSearchParams} from "react-router-dom";
import { useEffect } from "react";
import ConfirmationMessage from "../components/ui/ConfirmationMessage";
import { useConfirmRegistration } from "../features/auth/hooks/useConfirmRegistration";


    export default function ConfirmationPage() {
        const [params] = useSearchParams();
        const navigate = useNavigate();
        const code = params.get("code");
        const state = useConfirmRegistration(code);

          // Redirect to sign in after successful confirmation
        useEffect(() => {
            if (state === "ok") {
                navigate("/login", { replace: true });
            }
        }, [state, navigate]);

        if (state === "ok") {
            return null;
        }

        const uiState = state === "idle" ? "loading" : state;
        return <ConfirmationMessage state={uiState} />;
    }




