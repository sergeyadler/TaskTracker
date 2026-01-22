import { useState } from "react";
import axiosInstance from "../../../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/ui/utils/useToast";
import {isAxiosError } from "axios";
import type {ApiErrorBody} from "../utils/types";

export default function ChangePasswordCard({ onClose }: { onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const validate = () => {
        if (!currentPassword.trim()) return "Enter your current password.";
        if (newPassword.length < 8 || newPassword.length > 72)
            return "New password must be from 8-72 symbols.";
        if (newPassword === currentPassword)
            return "The new password must not match the current one.";
        if (confirmNewPassword !== newPassword)
            return "Confirm password does not match.";
        return null;
    };

    const err = validate();
    const canSubmit = !err && !submitting;

    const onSubmit = async () => {
        const localErr = validate();
        if (localErr) {
            showError(localErr);
            return;
        }

        try {
            setSubmitting(true);
            await axiosInstance.put("/users/password", {
                currentPassword,
                newPassword,
                confirmNewPassword,
            });

            showSuccess("Password updated. Logging out…");

            // очистить форму и закрыть карточку
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            onClose();

            // авто-логаут и редирект
            await axiosInstance.post("/auth/logout");
            navigate("/login");
        } catch (err: unknown) {
            let msg = "Failed to change password";
            if (isAxiosError(err)) {
                const data = err.response?.data as ApiErrorBody | undefined;
                msg = data?.message || data?.error || err.message || msg;
            } else if (err instanceof Error) {
                msg = err.message || msg;
            }
            showError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto mt-4 w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Change password</h2>
                <button
                    onClick={onClose}
                    className="rounded px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
                >
                    Close
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="mb-1 block text-sm font-medium">Current password *</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded border p-3 focus:ring-2 focus:ring-black"
                        autoComplete="current-password"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">New Password *</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded border p-3 focus:ring-2 focus:ring-black"
                        autoComplete="new-password"
                    />
                    <p className="mt-1 text-xs text-gray-500">8–72 symbols</p>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Confirming a new password*</label>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full rounded border p-3 focus:ring-2 focus:ring-black"
                        autoComplete="new-password"
                    />
                </div>

                <button
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className="mt-2 w-full rounded bg-black p-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? "Updating…" : "Update password"}
                </button>

                <ul className="mt-2 list-disc pl-5 text-xs text-gray-500">
                    <li>After changing your password, you will be logged out and redirected to the login page.</li>
                    <li>Use a unique password.</li>
                </ul>
            </div>
        </div>
    );
}
