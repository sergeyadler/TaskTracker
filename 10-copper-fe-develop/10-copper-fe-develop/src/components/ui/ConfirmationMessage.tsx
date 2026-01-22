import React from "react";

type Props = { state: "loading" | "ok" | "err" };

export default function ConfirmationMessage({ state }: Props) {
    const wrap: React.CSSProperties = {
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    };

    if (state === "loading") {
        return <div style={wrap}><p>Confirming…</p></div>;
    }
    if (state === "err") {
        return (
            <div style={wrap}>
                <div>
                    <strong>Confirmation failed</strong>
                    <p>Link is invalid or already used.</p>
                </div>
            </div>
        );
    }
    return (
        <div style={wrap}>
            <div>
                <strong>Registration confirmed</strong>
                <p>Your email has been successfully confirmed.</p>
                <p>Redirecting to sign in page...</p>
            </div>
        </div>
    );
}
