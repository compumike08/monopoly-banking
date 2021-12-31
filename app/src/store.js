import { configureStore } from '@reduxjs/toolkit';
import gamesSlice from './features/games/gamesSlice';

export const store = configureStore({
    reducer: {
      gamesData: gamesSlice
    },
  });
