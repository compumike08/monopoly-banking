import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { createNewGame, addNewUserToGame, fetchGameByCode } from "./gamesAPI";

const initialState = {
    activeGame: {
        gameId: null,
        code: null,
        users: [],
        moneySinks: [],
        loggedInUserId: null
    },
    fetchExistingGameByCodeStatus: IDLE_STATUS,
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
    async (data) => {
        return await addNewUserToGame(data.gameId, data);
    }
);

export const fetchExistingGameByCodeAction = createAsyncThunk(
    'games/fetchExistingGameByCodeAction',
    async (gameCode) => {
        return await fetchGameByCode(gameCode);
    }
)

export const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        userReceivedFromWs(state, action) {
            state.activeGame.users.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewGameAction.pending, (state) => {
                state.createNewGameStatus = LOADING_STATUS;
            })
            .addCase(createNewGameAction.fulfilled, (state, action) => {
                state.createNewGameStatus = IDLE_STATUS;
                state.activeGame.gameId = action.payload.gameId;
                state.activeGame.code = action.payload.code;
                state.activeGame.users = action.payload.users;
                state.activeGame.moneySinks = action.payload.moneySinks;
            })
            .addCase(createNewGameAction.rejected, (state) => {
                state.createNewGameStatus = ERROR_STATUS;
            })
            .addCase(addNewUserToGameAction.pending, (state) => {
                state.addNewUserToGameStatus = LOADING_STATUS;
            })
            .addCase(addNewUserToGameAction.fulfilled, (state, action) => {
                state.addNewUserToGameStatus = IDLE_STATUS;
                state.activeGame.users.push(action.payload);
                state.activeGame.loggedInUserId = action.payload.userId;
            })
            .addCase(addNewUserToGameAction.rejected, (state) => {
                state.addNewUserToGameStatus = ERROR_STATUS;
            })
            .addCase(fetchExistingGameByCodeAction.pending, (state) => {
                state.fetchExistingGameByCodeStatus = LOADING_STATUS;
            })
            .addCase(fetchExistingGameByCodeAction.fulfilled, (state, action) => {
                state.fetchExistingGameByCodeStatus = IDLE_STATUS;
                state.activeGame.gameId = action.payload.gameId;
                state.activeGame.code = action.payload.code;
                state.activeGame.users = action.payload.users;
                state.activeGame.moneySinks = action.payload.moneySinks;
            })
            .addCase(fetchExistingGameByCodeAction.rejected, (state) => {
                state.fetchExistingGameByCodeStatus = ERROR_STATUS;
            });
    }
});

const { actions, reducer } = gamesSlice;

export const { userReceivedFromWs } = actions;

export default reducer;
