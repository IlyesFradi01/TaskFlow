import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";

import api from "../services/api";

const savedToken = localStorage.getItem("taskflow_token");

const savedUser = localStorage.getItem("taskflow_user");


// LOGIN
export const login = createAsyncThunk(
    "auth/login",

    async (credentials, thunkAPI) => {
        try {
            const { data } = await api.post(
                "/auth/login",
                credentials
            );

            localStorage.setItem("taskflow_token", data.token);

            localStorage.setItem(
                "taskflow_user",
                JSON.stringify(data.user)
            );

            return data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);


// REGISTER
export const register = createAsyncThunk(
    "auth/register",

    async (details, thunkAPI) => {
        try {
            const { data } = await api.post(
                "/auth/register",
                details
            );

            localStorage.setItem("taskflow_token", data.token);

            localStorage.setItem(
                "taskflow_user",
                JSON.stringify(data.user)
            );

            return data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);


// GET CURRENT USER
export const loadMe = createAsyncThunk(
    "auth/loadMe",

    async (_, thunkAPI) => {
        try {
            const { data } = await api.get("/auth/me");

            localStorage.setItem(
                "taskflow_user",
                JSON.stringify(data.user)
            );

            return data.user;

        } catch (error) {
            localStorage.removeItem("taskflow_token");
            localStorage.removeItem("taskflow_user");

            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Session expired"
            );
        }
    }
);


// INITIAL STATE
const initialState = {
    token: savedToken || null,

    user: savedUser ? JSON.parse(savedUser) : null,

    loading: false,

    initialized: !savedToken,

    error: null
};


// SLICE
const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        logout: (state) => {
            state.token = null;
            state.user = null;
            state.error = null;
            state.initialized = true;

            localStorage.removeItem("taskflow_token");
            localStorage.removeItem("taskflow_user");
        },

        clearAuthError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {

        builder

            // LOGIN
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.initialized = true;
            })

            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // REGISTER
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.initialized = true;
            })

            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // CURRENT USER
            .addCase(loadMe.pending, (state) => {
                state.loading = true;
            })

            .addCase(loadMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.initialized = true;
            })

            .addCase(loadMe.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.initialized = true;
            });
    }
});

export const {
    logout,
    clearAuthError
} = authSlice.actions;

export default authSlice.reducer;