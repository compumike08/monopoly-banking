import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { formatNumberAsCurrency } from '../../utils/util';
import { createNewGame, addNewUserToGame, fetchGameByCode, joinGameAsExistingUser } from "../../api/gamesAPI";
import { sendPayment } from '../../api/paymentsAPI';

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
    addNewUserToGameStatus: IDLE_STATUS,
    joinGameAsExistingUserStatus: IDLE_STATUS
};

export const createNewGameAction = createAsyncThunk(
    'games/createNewGameAction',
    async (data) => {
        return await createNewGame(data);
    }
);

export const addNewUserToGameAction = createAsyncThunk(
    'games/addNewUserToGameAction',
    async (data) => {
        return await addNewUserToGame(data.gameId, data);
    }
);

export const joinGameAsExistingUserAction = createAsyncThunk(
    'games/joinGameAsExistingUserAction',
    async (data) => {
        return await joinGameAsExistingUser(data.gameId, data.userCode);
    }
);

export const fetchExistingGameByCodeAction = createAsyncThunk(
    'games/fetchExistingGameByCodeAction',
    async (gameCode) => {
        return await fetchGameByCode(gameCode);
    }
)

export const sendPaymentAction = createAsyncThunk(
    'games/sendPayment',
    async (data) => {
        return await sendPayment(data);
    }
);

const processPayment = (state, action, isFromWebsocketMsg) => {
    const { isFromSink, isToSink, fromUser, toUser, fromMoneySink, toMoneySink, amountPaid } = action.payload;
    state.sendPaymentStatus = IDLE_STATUS;

    let fromObject = null;
    let toObject = null;
    
    if (!isFromSink) {
        const userIndex = state.activeGame.users.findIndex(user => user.id === fromUser.id);
        if (userIndex > -1) {
            state.activeGame.users[userIndex] = fromUser;
            fromObject = fromUser;
        }
    } else {
        const sinkIndex = state.activeGame.moneySinks.findIndex(sink => sink.id === fromMoneySink.id);
        if (sinkIndex > -1) {
            state.activeGame.moneySinks[sinkIndex] = fromMoneySink;
            fromObject = fromMoneySink;
        }
    }

    if (!isToSink) {
        const userIndex = state.activeGame.users.findIndex(user => user.id === toUser.id);
        if (userIndex > -1) {
            state.activeGame.users[userIndex] = toUser;
            toObject = toUser;
        }
    } else {
        const sinkIndex = state.activeGame.moneySinks.findIndex(sink => sink.id === toMoneySink.id);
        if (sinkIndex > -1) {
            state.activeGame.moneySinks[sinkIndex] = toMoneySink;
            toObject = toMoneySink;
        }
    }

    if (fromObject && toObject && isFromWebsocketMsg) {
        const fromName = fromObject.name;
        const toName = toObject.name;
        const formattedAmountPaid = formatNumberAsCurrency(amountPaid);

        const toastMessage = `${fromName} paid ${toName} ${formattedAmountPaid}`;
        toast.success(toastMessage);
    }

    return state;
};

export const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        userReceivedFromWs(state, action) {
            state.activeGame.users.push(action.payload);
        },
        paymentReceivedFromWs(state, action) {
            state = processPayment(state, action, true);
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
                state.activeGame.loggedInUserId = action.payload.id;
            })
            .addCase(addNewUserToGameAction.rejected, (state) => {
                state.addNewUserToGameStatus = ERROR_STATUS;
            })
            .addCase(joinGameAsExistingUserAction.pending, (state) => {
                state.joinGameAsExistingUserStatus = LOADING_STATUS;
            })
            .addCase(joinGameAsExistingUserAction.fulfilled, (state, action) => {
                state.joinGameAsExistingUserStatus = IDLE_STATUS;
                state.activeGame.loggedInUserId = action.payload.id;
            })
            .addCase(joinGameAsExistingUserAction.rejected, (state => {
                state.joinGameAsExistingUserStatus = ERROR_STATUS;
            }))
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
            })
            .addCase(sendPaymentAction.pending, (state) => {
                state.sendPaymentStatus = LOADING_STATUS;
            })
            .addCase(sendPaymentAction.fulfilled, (state, action) => {
                state = processPayment(state, action, false);
            })
            .addCase(sendPaymentAction.rejected, (state) => {
                state.sendPaymentStatus = ERROR_STATUS;
            });
    }
});

const { actions, reducer } = gamesSlice;

export const { userReceivedFromWs, paymentReceivedFromWs } = actions;

export default reducer;
