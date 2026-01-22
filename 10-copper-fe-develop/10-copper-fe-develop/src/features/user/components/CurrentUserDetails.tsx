// src/features/user/components/CurrentUserDetails.tsx
import { useEffect, useMemo, useState, type ChangeEvent, type JSX } from "react";
import axiosInstance from "../../../lib/axiosInstance";
import type {LIProps, UserDetails} from "../utils/types";
import { Link, useNavigate } from "react-router-dom";
import ChangePasswordCard from "./ChangePasswordCard";

/** ===== Validation helpers ===== */
const rxAllowedName = /^[\p{L}\p{N}\- ]+$/u; // буквы, цифры, пробелы, дефисы
const rxEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // базовая проверка формата email
const rxImageExt = /\.(jpe?g|png|webp)$/i;

const trimOrEmpty = (v?: string) => (v ?? "").trim();
//const notOnlySpaces = (v?: string) => trimOrEmpty(v).length > 0;

const isValidUrl = (v?: string) => {
    if (!v) return true; // optional
    try {
        const u = new URL(v);
        // необязательно, но рекомендуем изображение
        return !!u.protocol && !!u.host && rxImageExt.test(u.pathname);
    } catch {
        return false;
    }
};

const sanitizeBio = (v?: string) =>
    (v ?? "").replace(/<[^>]*>/g, ""); // простая вырезка HTML/JS

type Errors = Partial<Record<keyof Omit<UserDetails, "role" | "confirmationStatus">, string>>;

export default function CurrentUserDetails(): JSX.Element {
    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [initialData, setInitialData] = useState<UserDetails | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate();
    const [showChangePwd, setShowChangePwd] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get<UserDetails>("/users/me");
                setUserData(res.data);
                setInitialData(res.data);
            } catch (err) {
                console.error("Fetch /users/me failed:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /** ===== Validation ===== */
    const validate = (data: UserDetails): Errors => {
        const e: Errors = {};

        // displayName: required, 2..50, allowed chars, not only spaces
        const dn = trimOrEmpty(data.displayName);
        if (!dn) e.displayName = "Display name is required.";
        else if (dn.length < 2) e.displayName = "Minimum length is 2.";
        else if (dn.length > 50) e.displayName = "Maximum length is 50.";
        else if (!rxAllowedName.test(dn))
            e.displayName = "Only letters, digits, spaces and hyphens are allowed.";

        // email: required, format, <=100 (read-only, но валидируем на всякий)
        const em = trimOrEmpty(data.email);
        if (!em) e.email = "Email is required.";
        else if (em.length > 100) e.email = "Maximum length is 100.";
        else if (!rxEmail.test(em)) e.email = "Invalid email format.";

        // position: required, 2..100, allowed chars, not only spaces
        const pos = trimOrEmpty(data.position);
        if (!pos) e.position = "Position is required.";
        else if (pos.length < 2) e.position = "Minimum length is 2.";
        else if (pos.length > 100) e.position = "Maximum length is 100.";
        else if (!rxAllowedName.test(pos))
            e.position = "Only letters, digits, spaces and hyphens are allowed.";

        // department: required, 2..100, allowed chars
        const dep = trimOrEmpty(data.department);
        if (!dep) e.department = "Department is required.";
        else if (dep.length < 2) e.department = "Minimum length is 2.";
        else if (dep.length > 100) e.department = "Maximum length is 100.";
        else if (!rxAllowedName.test(dep))
            e.department = "Only letters, digits, spaces and hyphens are allowed.";

        // avatarUrl: optional, valid URL to image
        if (!isValidUrl(data.avatarUrl)) {
            e.avatarUrl = "Provide a valid image URL (jpg, jpeg, png, webp).";
        }

        // bio: optional, <=500, no HTML (sanitized)
        const bio = sanitizeBio(data.bio);
        if (bio.length > 500) e.bio = "Maximum length is 500.";
        // (bio может содержать emoji — ок)

        return e;
    };

    const hasChanges = useMemo(() => {
        if (!userData || !initialData) return false;
        const norm = (v?: string) => (v ?? "").trim();
        return (
            norm(userData.displayName) !== norm(initialData.displayName) ||
            norm(userData.position) !== norm(initialData.position) ||
            norm(userData.department) !== norm(initialData.department) ||
            norm(userData.avatarUrl) !== norm(initialData.avatarUrl) ||
            sanitizeBio(userData.bio) !== sanitizeBio(initialData.bio)
        );
    }, [userData, initialData]);

    const isValid = useMemo(() => {
        if (!userData) return false;
        const v = validate(userData);
        setErrors(v);
        return Object.keys(v).length === 0;
    }, [userData]);

    const saveEnabled = isEdit && hasChanges && isValid;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-gray-500">
                Loading profile...
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Link
                    to="/login"
                    className="rounded bg-black px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    Sign in
                </Link>
            </div>
        );
    }

    /** ===== Handlers ===== */
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setUserData((prev) => {
            if (!prev) return prev;
            const next = { ...prev, [name]: name === "bio" ? sanitizeBio(value) : value };
            // «живой» пересчёт ошибок для изменённого поля
            const v = validate(next);
            setErrors(v);
            return next;
        });
    };

    const handleSave = async () => {
        if (!userData || !saveEnabled) return;
        try {
            const body = {
                displayName: trimOrEmpty(userData.displayName),
                position: trimOrEmpty(userData.position),
                department: trimOrEmpty(userData.department),
                avatarUrl: trimOrEmpty(userData.avatarUrl) || undefined,
                bio: sanitizeBio(userData.bio),
            };

            const res = await axiosInstance.put<UserDetails>("/users/update", body);
            setUserData(res.data);
            setInitialData(res.data);
            setIsEdit(false);
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUserData(null);
            navigate("/");
        }
    };

    const initials = (userData.displayName ?? userData.email ?? "U")
        .toUpperCase()
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("");

    return (
        <div className="mx-auto mt-4 flex max-w-md flex-col items-center space-y-6 rounded-lg border bg-white p-6 shadow-sm">
            {userData.avatarUrl ? (
                <img
                    src={userData.avatarUrl}
                    alt={`${userData.displayName ?? "User"} avatar`}
                    loading="lazy"
                    className="h-32 w-32 rounded-full border-2 border-gray-200 object-cover"
                    onError={(e) => {
                        // graceful fallback если URL битый
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-200 text-2xl font-semibold text-gray-700">
                    {initials}
                </div>
            )}

            {!isEdit ? (
                <div className="w-full space-y-2">
                    <FieldRow label="Display Name" value={userData.displayName || "—"} />
                    <FieldRow label="E-mail" value={userData.email} />
                    <FieldRow label="Department" value={userData.department || "—"} />
                    <FieldRow label="Position" value={userData.position || "—"} />
                    {userData.bio && (
                        <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700">
                            {userData.bio}
                        </p>
                    )}

                    {(userData.role || userData.confirmationStatus) && (
                        <div className="mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
                            {userData.role && <div>Role: {userData.role}</div>}
                            {userData.confirmationStatus && (
                                <div>Status: {userData.confirmationStatus}</div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 gap-3">
                        <button
                            className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                            onClick={() => setIsEdit(true)}
                        >
                            Edit
                        </button>

                        <button
                            className="inline-flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                            onClick={() => setShowChangePwd((v) => !v)}
                        >
                            {showChangePwd ? "Hide password form" : "Change password"}
                        </button>

                        <button
                            className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>

                    {showChangePwd && (
                        <ChangePasswordCard onClose={() => setShowChangePwd(false)} />
                    )}
                </div>
            ) : (
                <div className="w-full space-y-4">
                    {/* displayName (required) */}
                    <LabeledInput
                        label="Display Name *"
                        name="displayName"
                        value={userData.displayName || ""}
                        onChange={handleChange}
                        placeholder="Иван Иванов / John-Doe"
                        maxLength={50}
                        error={errors.displayName}
                        required
                    />

                    {/* email (read-only, показываем для справки) */}
                    <LabeledInput
                        label="E-mail"
                        name="email"
                        value={userData.email}
                        onChange={() => {}}
                        readOnly
                    />

                    {/* department (required) */}
                    <LabeledInput
                        label="Department *"
                        name="department"
                        value={userData.department || ""}
                        onChange={handleChange}
                        placeholder="Отдел разработки / Team A"
                        maxLength={100}
                        error={errors.department}
                        required
                    />

                    {/* position (required) */}
                    <LabeledInput
                        label="Position *"
                        name="position"
                        value={userData.position || ""}
                        onChange={handleChange}
                        placeholder="Backend Developer / Аналитик"
                        maxLength={100}
                        error={errors.position}
                        required
                    />

                    {/* avatarUrl (optional) */}
                    <LabeledInput
                        label="Avatar URL"
                        name="avatarUrl"
                        value={userData.avatarUrl || ""}
                        onChange={handleChange}
                        placeholder="https://cdn.site.com/avatar.webp"
                        error={errors.avatarUrl}
                    />

                    {/* bio (optional, <=500) */}
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <span className="text-xs text-gray-500">
                {(userData.bio || "").length}/500
              </span>
                        </div>
                        <textarea
                            name="bio"
                            value={userData.bio || ""}
                            onChange={handleChange}
                            maxLength={500}
                            placeholder="Разработчик, люблю TypeScript и котов 🐈"
                            className={`h-32 w-full resize-none rounded border p-3 focus:ring-2 ${
                                errors.bio ? "border-red-500 focus:ring-red-400" : "focus:ring-black"
                            }`}
                            aria-invalid={!!errors.bio}
                        />
                        {errors.bio && (
                            <p className="mt-1 text-xs text-red-600">{errors.bio}</p>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!saveEnabled}
                        className="mt-2 w-full rounded bg-black p-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => {
                            setUserData(initialData); // откатить изменения
                            setIsEdit(false);
                            setErrors({});
                        }}
                        className="w-full rounded border p-2 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    {/* Подсказка по формату */}
                    <div className="text-xs text-gray-500">
                        * — обязательные поля. Разрешены буквенно-цифровые символы, пробелы и дефисы.
                    </div>
                </div>
            )}
        </div>
    );
}

/** ===== Dumb UI helpers ===== */
function FieldRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="font-bold">{label}:</span>
            <span>{value}</span>
        </div>
    );
}


function LabeledInput({
                          label,
                          name,
                          value,
                          onChange,
                          placeholder,
                          maxLength,
                          error,
                          required,
                          readOnly,
                      }: LIProps) {
    return (
        <div>
            <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
                {maxLength && (
                    <span className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
                )}
            </div>
            <input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                readOnly={readOnly}
                className={`w-full rounded border p-3 focus:ring-2 ${
                    error ? "border-red-500 focus:ring-red-400" : "focus:ring-black"
                } ${readOnly ? "bg-gray-50 text-gray-500" : ""}`}
                aria-invalid={!!error}
                aria-required={required}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
