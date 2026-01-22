import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../services/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AxiosError } from "axios";

export const ResetPasswordForm: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .required("New password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("Confirm password is required"),
        }),
        onSubmit: async (values) => {
            if (!token) {
                setError("Invalid or missing token. Please request a new password reset.");
                return;
            }

            try {
                await resetPassword({ token, newPassword: values.password});
                setSuccess(true);
                setError(null);
            } catch (err) {
                const axiosError = err as AxiosError<{ message?: string }>;
                console.error(axiosError);
                setError(
                    axiosError.response?.data?.message ||
                    "This link is invalid or has expired. Please request a new one."
                );
            }
        },
    });

    // ✅ SUCCESS SCREEN
    if (success) {
        return (
            <div className="mx-auto max-w-sm space-y-6 p-6 border rounded-lg shadow-sm mt-10 text-center">
                <p className="text-green-600 text-sm">
                    ✅ Your password has been successfully reset.
                </p>
                <Link
                    to="/login"
                    className="text-blue-600 hover:underline text-sm font-medium"
                >
                    Go to login
                </Link>
            </div>
        );
    }

    // 🔑 MAIN FORM
    return (
        <div className="mx-auto max-w-sm space-y-6 p-6 border rounded-lg shadow-sm mt-10">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Reset Password
                </h2>
                <p className="text-sm text-gray-500 text-center">
                    Enter your new password below
                </p>

                {/* ⚠️ ERROR MESSAGE WITH LINK */}
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 text-center space-y-2">
                        <p>{error}</p>
                        <Link
                            to="/forgot-password"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Request a new password reset link
                        </Link>
                    </div>
                )}
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input
                        type="password"
                        placeholder="New Password"
                        {...formik.getFieldProps("password")}
                        className="w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-sm text-red-500">{formik.errors.password}</p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...formik.getFieldProps("confirmPassword")}
                        className="w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                            {formik.errors.confirmPassword}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};