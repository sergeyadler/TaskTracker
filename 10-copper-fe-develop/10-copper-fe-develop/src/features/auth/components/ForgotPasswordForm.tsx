import React, { useState } from "react";
import { requestPasswordReset } from "../services/api";
import { AxiosError } from "axios";

export const ForgotPasswordForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await requestPasswordReset({ email });
            setIsSubmitted(true);
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            console.error(axiosError);
            setError(
                axiosError.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="mx-auto mt-10 max-w-sm p-6 border rounded-lg shadow-sm text-center">
                <p className="text-green-600 text-sm">
                    If an account with this email exists, a password reset email has been sent.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-sm space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Forgot Password?</h1>
                <p className="text-sm text-muted-foreground text-gray-500">
                    Enter your email to reset your password
                </p>
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                        {error}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    {loading ? "Sending..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};