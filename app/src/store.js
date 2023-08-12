import { configureStore } from '@reduxjs/toolkit';
import gamesSlice from './features/games/gamesSlice';
import authSlice from './features/auth/authSlice';

export const store = configureStore({
    reducer: {
      gamesData: gamesSlice,
      authData: authSlice
    }
  });
