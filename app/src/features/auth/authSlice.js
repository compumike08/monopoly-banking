import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { registerUser, authenticate } from '../../api/authAPI';

const initialState = {
    isUserLoggedIn: null,
    registerUserStatus: IDLE_STATUS,
    loginStatus: IDLE_STATUS
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
            });
    }
});

const { actions, reducer } = authSlice;

export const { resetAuthData } = actions;

export default reducer;
