import {createAppSlice} from "../../../app/createAppSlice";
import type {AuthSliceState, Credentials, UserRegistrationDto,} from "../types";
import * as api from "../services/api";
import {isAxiosError} from "axios";

const initialState: AuthSliceState = {
    isAuthenticated: false,
    user: undefined,
    loginErrorMessage: undefined,
    registrationErrorMessage: undefined,
    registrationSuccessMessage: undefined,
};

export const authSlice = createAppSlice({
    name: "auth",
    initialState,
    reducers: (create) => ({
        login: create.asyncThunk(
            async (credentials: Credentials, {rejectWithValue}) => {
                try{
                    return await api.fetchLogin(credentials);
                } catch(err: unknown)  {
                    if (isAxiosError(err)) {
                        return rejectWithValue(err.response?.data?.message || "Internal Server Error");
                    }
                    return rejectWithValue("Network error or server is unavailable");
                }
            },
            {
                pending: (state) => {
                    state.isAuthenticated = false;
                    state.loginErrorMessage=undefined
                },
                fulfilled: (state, action) => {
                    state.isAuthenticated = true;
                    state.user = action.payload;
                    state.loginErrorMessage = undefined;
                },
                rejected: (state, action) => {
                    state.isAuthenticated = false;
                    state.user = undefined;
                    state.loginErrorMessage = (action.payload as string)|| action.error.message;
                },
            }
        ),

        register: create.asyncThunk(
            async (dto: UserRegistrationDto, {rejectWithValue}) => {
                try {
                    const response = await api.fetchRegister(dto);
                    // Return user data and firstName/lastName for personalized message
                    return {
                        user: response.user || undefined,
                        firstName: dto.firstName,
                        lastName: dto.lastName
                    };
                } catch (err: unknown) {
                    if (isAxiosError(err)) {
                        const errorMessage =
                            err.response?.data?.message ||
                            err.response?.data?.error ||
                            err.message ||
                            "Internal Server Error";
                        return rejectWithValue(errorMessage);
                    }
                    return rejectWithValue("Network error or server is unavailable");
                }
            },// The value we return becomes the `fulfilled` action payload
            {
                pending: (state) => {
                    state.isAuthenticated = false;
                    state.registrationErrorMessage = undefined;
                    state.registrationSuccessMessage = undefined;
                },
                fulfilled:
                    (state, action) => {
                        // If user is returned (with token/session), set authenticated
                        if (action.payload.user) {
                            state.isAuthenticated = true;
                            state.user = action.payload.user;
                        } else {
                            state.isAuthenticated = false;
                            state.user = undefined;
                        }
                        state.registrationErrorMessage = undefined;
                        // Personalized success message
                        const firstName = action.payload.firstName || "";
                        const lastName = action.payload.lastName || "";
                        const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || "";
                        const greeting = name ? `Hello ${name}! ` : "";
                        state.registrationSuccessMessage = `${greeting}Registration successful! Please check your email to confirm your account.`;
                    },
                rejected:
                    (state, action) => {
                        state.isAuthenticated = false;
                        state.user = undefined;
                        state.registrationSuccessMessage = undefined;
                        console.log("Registration error", action.payload);
                        state.registrationErrorMessage = (action.payload as string) || "An error occurred during registration";
                    },
            }
        ),
    }),
    // You can define your selectors here. These selectors receive the slice
    // state as their first argument.
    selectors: {
        selectIsAuthenticated: (state) => state.isAuthenticated,
        selectUser: (state) => state.user,
        selectRole: (state) => state.user?.role,
        selectLoginError: (state) => state.loginErrorMessage,
        selectRegistrationError: (state) => state.registrationErrorMessage,
        selectRegistrationSuccess: (state) => state.registrationSuccessMessage,
    },
});

// // Action creators are generated for each case reducer function.
export const {login, register} = authSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
    selectIsAuthenticated,
    selectUser,
    selectRole,
    selectLoginError,
    selectRegistrationError,
    selectRegistrationSuccess,
} = authSlice.selectors;
