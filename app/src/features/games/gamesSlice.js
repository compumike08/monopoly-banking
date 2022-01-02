import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { fetchGames, createNewGame, addNewUserToGame } from "./gamesAPI";

const initialState = {
    games: [],
    activeGame: {},
    fetchGamesStatus: IDLE_STATUS,
    createNewGameStatus: IDLE_STATUS,
    addNewUserToGameStatus: IDLE_STATUS
};

export const fetchGamesAction = createAsyncThunk(
    'games/fetchGamesAction',
    async () => {
        return await fetchGames();
    }
);

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
            .addCase(fetchGamesAction.pending, (state) => {
                state.fetchGamesStatus = LOADING_STATUS;
            })
            .addCase(fetchGamesAction.fulfilled, (state, action) => {
                state.fetchGamesStatus = IDLE_STATUS;
                state.games = action.payload;
            })
            .addCase(fetchGamesAction.rejected, (state) => {
                state.fetchGamesStatus = ERROR_STATUS;
            })
            .addCase(createNewGameAction.pending, (state) => {
                state.createNewGameStatus = LOADING_STATUS;
            })
            .addCase(createNewGameAction.fulfilled, (state, action) => {
                state.createNewGameStatus = IDLE_STATUS;
                state.games.push(action.payload);
                state.activeGame = action.payload;
            })
            .addCase(createNewGameAction.rejected, (state) => {
                state.createNewGameStatus = ERROR_STATUS;
            })
            .addCase(addNewUserToGameAction.pending, (state) => {
                state.addNewUserToGameStatus = LOADING_STATUS;
            })
            .addCase(addNewUserToGameAction.fulfilled, (state, action) => {
                state.addNewUserToGameStatus = IDLE_STATUS;
                state.games.find(game => game.gameId === action.payload.gameId)
                    .users.push(action.payLoad);
            })
            .addCase(addNewUserToGameAction.rejected, (state) => {
                state.addNewUserToGameStatus = ERROR_STATUS;
            });
    }
});

export default gamesSlice.reducer;
