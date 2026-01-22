import type {ChangeEvent} from "react";

export interface UserDetails {
    email: string;
    displayName?: string;
    position?: string;
    department?: string;
    avatarUrl?: string;
    bio?: string;

    // приходят с бэка — можно показать внизу карточки
    role?: string; // e.g. "ROLE_USER"
    confirmationStatus?: "UNCONFIRMED" | "CONFIRMED";
}

export type LIProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    maxLength?: number;
    error?: string;
    required?: boolean;
    readOnly?: boolean;
};

export type ApiErrorBody = { message?: string; error?: string };