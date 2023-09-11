import { configureStore } from "@reduxjs/toolkit";
import gamesSlice from "./features/games/gamesSlice";
import authSlice from "./features/auth/authSlice";
import userProfileSlice from "./features/userProfile/userProfileSlice";
import propertyClaimsSlice from "./features/properties/propertiesSlice";

export const store = configureStore({
  reducer: {
    gamesData: gamesSlice,
    authData: authSlice,
    userProfileData: userProfileSlice,
    propertyClaimsData: propertyClaimsSlice
  }
});
