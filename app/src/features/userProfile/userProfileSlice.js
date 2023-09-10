import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS,
} from "../../constants/general";
import { editUser, getCurrentUser } from "../../api/userProfileAPI";

const initialState = {
  userProfile: {
    username: "",
    email: "",
  },
  getUserProfileStatus: IDLE_STATUS,
  editUserProfileStatus: IDLE_STATUS,
};

export const getUserProfileAction = createAsyncThunk(
  "userProfile/getUserProfileAction",
  async () => {
    return await getCurrentUser();
  },
);

export const editUserProfileAction = createAsyncThunk(
  "userProfile/editUserProfileAction",
  async (data) => {
    return await editUser(data);
  },
);

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileAction.pending, (state) => {
        state.getUserProfileStatus = LOADING_STATUS;
      })
      .addCase(getUserProfileAction.fulfilled, (state, action) => {
        state.getUserProfileStatus = IDLE_STATUS;
        state.userProfile = action.payload;
      })
      .addCase(getUserProfileAction.rejected, (state) => {
        state.getUserProfileStatus = ERROR_STATUS;
      })
      .addCase(editUserProfileAction.pending, (state) => {
        state.editUserProfileStatus = LOADING_STATUS;
      })
      .addCase(editUserProfileAction.fulfilled, (state, action) => {
        state.editUserProfileStatus = IDLE_STATUS;
        state.userProfile = action.payload;
      })
      .addCase(editUserProfileAction.rejected, (state) => {
        state.editUserProfileStatus = ERROR_STATUS;
      });
  },
});

const { reducer } = userProfileSlice;

export default reducer;
