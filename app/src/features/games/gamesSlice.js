import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { createNewGame, addNewUserToGame } from "./gamesAPI";

const initialState = {
    activeGame: {
        gameId: null,
        code: null,
        users: [],
        moneySinks: []
    },
    createNewGameStatus: IDLE_STATUS,
    addNewUserToGameStatus: IDLE_STATUS
};

export const createNewGameAction = createAsyncThunk(
    'games/createNewGameAction',
    async () => {
        return await createNewGame();
    }
);

export const addNewUserToGameAction = createAsyncThunk(
    'games/addNewUserToGameAction',
    async (gameId, data) => {
        return await addNewUserToGame(gameId, data);
    }
);

export const gamesSlice = createSlice({
    name: 'games',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createNewGameAction.pending, (state) => {
                state.createNewGameStatus = LOADING_STATUS;
            })
            .addCase(createNewGameAction.fulfilled, (state, action) => {
                state.createNewGameStatus = IDLE_STATUS;
                state.activeGame.gameId = action.payload.gameId;
                state.activeGame.code = action.payload.code;
            })
            .addCase(createNewGameAction.rejected, (state) => {
                state.createNewGameStatus = ERROR_STATUS;
            })
            .addCase(addNewUserToGameAction.pending, (state) => {
                state.addNewUserToGameStatus = LOADING_STATUS;
            })
            .addCase(addNewUserToGameAction.fulfilled, (state, action) => {
                state.addNewUserToGameStatus = IDLE_STATUS;
                state.activeGame.users.push(action.payLoad);
            })
            .addCase(addNewUserToGameAction.rejected, (state) => {
                state.addNewUserToGameStatus = ERROR_STATUS;
            });
    }
});

export default gamesSlice.reducer;
