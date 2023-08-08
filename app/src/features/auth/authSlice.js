import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { registerUser } from '../../api/authAPI';

const initialState = {
    loggedInUser: null,
    registerUserStatus: IDLE_STATUS
};

export const registerUserAction = createAsyncThunk(
    'auth/registerUserAction',
    async (data) => {
        return await registerUser(data);
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
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
            });
    }
});

const { reducer } = authSlice;

export default reducer;
