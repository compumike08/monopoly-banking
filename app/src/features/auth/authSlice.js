import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { registerUser, authenticate, sendPasswordResetEmail, resetPassword } from '../../api/authAPI';

const initialState = {
    isUserLoggedIn: null,
    registerUserStatus: IDLE_STATUS,
    loginStatus: IDLE_STATUS,
    requestPasswordResetStatus: IDLE_STATUS,
    resetPasswordStatus: IDLE_STATUS
};

export const registerUserAction = createAsyncThunk(
    'auth/registerUserAction',
    async (data) => {
        return await registerUser(data);
    }
);

export const loginAction = createAsyncThunk(
    'auth/loginAction',
    async (data) => {
        return await authenticate(data);
    }
);

export const requestPasswordResetAction = createAsyncThunk(
    'auth/requestPasswordResetAction',
    async (data) => {
        return await sendPasswordResetEmail(data);
    }
);

export const resetPasswordAction = createAsyncThunk(
    'auth/resetPasswordAction',
    async (data) => {
        return await resetPassword(data);
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuthData() {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUserAction.pending, (state) => {
                state.registerUserStatus = LOADING_STATUS;
            })
            .addCase(registerUserAction.fulfilled, (state) => {
                state.registerUserStatus = IDLE_STATUS;
            })
            .addCase(registerUserAction.rejected, (state) => {
                state.registerUserStatus = ERROR_STATUS;
            })
            .addCase(loginAction.pending, (state) => {
                state.loginStatus = LOADING_STATUS;
            })
            .addCase(loginAction.fulfilled, (state) => {
                state.loginStatus = IDLE_STATUS;
                state.isUserLoggedIn = true;

            })
            .addCase(loginAction.rejected, (state) => {
                state.loginStatus = ERROR_STATUS;
            })
            .addCase(requestPasswordResetAction.pending, (state) => {
                state.requestPasswordResetStatus = LOADING_STATUS;
            })
            .addCase(requestPasswordResetAction.fulfilled, (state) => {
                state.requestPasswordResetStatus = IDLE_STATUS;

            })
            .addCase(requestPasswordResetAction.rejected, (state) => {
                state.requestPasswordResetStatus = ERROR_STATUS;
            })
            .addCase(resetPasswordAction.pending, (state) => {
                state.resetPasswordStatus = LOADING_STATUS;
            })
            .addCase(resetPasswordAction.fulfilled, (state) => {
                state.resetPasswordStatus = IDLE_STATUS;

            })
            .addCase(resetPasswordAction.rejected, (state) => {
                state.resetPasswordStatus = ERROR_STATUS;
            });
    }
});

const { actions, reducer } = authSlice;

export const { resetAuthData } = actions;

export default reducer;
