import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { formatNumberAsCurrency } from '../../utils/util';
import { createNewGame, addNewUserToGame, fetchGameByCode, joinGameAsExistingUser, authenticate, registerSuccessfulLoginForJwt } from "../../api/gamesAPI";
import { sendPayment, getAllPaymentsList } from '../../api/paymentsAPI';

const initialState = {
    activeGame: {
        gameId: null,
        code: null,
        users: [],
        moneySinks: [],
        loggedInUserId: null,
        paymentRecords: []
    },
    fetchExistingGameByCodeStatus: IDLE_STATUS,
    createNewGameStatus: IDLE_STATUS,
    addNewUserToGameStatus: IDLE_STATUS,
    joinGameAsExistingUserStatus: IDLE_STATUS,
    sendPaymentStatus: IDLE_STATUS,
    getAllPaymentsListStatus: IDLE_STATUS
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
        const addUserResponse = await addNewUserToGame(data.gameId, data);
        const token = await authenticate(addUserResponse.code);
        registerSuccessfulLoginForJwt(addUserResponse.code, token);

        return addUserResponse;
    }
);

export const joinGameAsExistingUserAction = createAsyncThunk(
    'games/joinGameAsExistingUserAction',
    async (data) => {
        const joinGameUserResponse = await joinGameAsExistingUser(data.gameId, data.userCode);
        const token = await authenticate(joinGameUserResponse.code);
        registerSuccessfulLoginForJwt(joinGameUserResponse.code, token);

        return joinGameUserResponse;
    }
);

export const fetchExistingGameByCodeAction = createAsyncThunk(
    'games/fetchExistingGameByCodeAction',
    async (gameCode) => {
        return await fetchGameByCode(gameCode);
    }
)

export const getAllPaymentsAction = createAsyncThunk(
    'games/getAllPayments',
    async (gameId) => {
        return await getAllPaymentsList(gameId);
    }
);

export const sendPaymentAction = createAsyncThunk(
    'games/sendPayment',
    async (data) => {
        return await sendPayment(data);
    }
);

const processPayment = (state, action, isFromWebsocketMsg) => {
    const { isFromSink, isToSink, fromUser, toUser, fromMoneySink, toMoneySink, amountPaid, payRequestUUID } = action.payload;
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

        state.activeGame.paymentRecords.push({
            payRequestUUID,
            fromName,
            toName,
            formattedAmountPaid
        });

        const toastMessage = `${fromName} paid ${toName} ${formattedAmountPaid}`;
        toast.success(toastMessage);
    }

    return state;
};

const processPaymentRecordList = (state, action) => {
    state.getAllPaymentsListStatus = IDLE_STATUS;
    
    action.payload.forEach(paymentRecord => {
        const { isFromSink, isToSink, fromUser, toUser, fromMoneySink, toMoneySink, amountPaid, payRequestUUID } = paymentRecord;

        let fromObject = null;
        let toObject = null;
        
        if (!isFromSink) {
            const userIndex = state.activeGame.users.findIndex(user => user.id === fromUser.id);
            if (userIndex > -1) {
                fromObject = fromUser;
            }
        } else {
            const sinkIndex = state.activeGame.moneySinks.findIndex(sink => sink.id === fromMoneySink.id);
            if (sinkIndex > -1) {
                fromObject = fromMoneySink;
            }
        }

        if (!isToSink) {
            const userIndex = state.activeGame.users.findIndex(user => user.id === toUser.id);
            if (userIndex > -1) {
                toObject = toUser;
            }
        } else {
            const sinkIndex = state.activeGame.moneySinks.findIndex(sink => sink.id === toMoneySink.id);
            if (sinkIndex > -1) {
                toObject = toMoneySink;
            }
        }

        const fromName = fromObject.name;
        const toName = toObject.name;
        const formattedAmountPaid = formatNumberAsCurrency(amountPaid);

        state.activeGame.paymentRecords.push({
            payRequestUUID,
            fromName,
            toName,
            formattedAmountPaid
        });
    });

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
            .addCase(joinGameAsExistingUserAction.rejected, (state) => {
                state.joinGameAsExistingUserStatus = ERROR_STATUS;
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
            })
            .addCase(sendPaymentAction.pending, (state) => {
                state.sendPaymentStatus = LOADING_STATUS;
            })
            .addCase(sendPaymentAction.fulfilled, (state, action) => {
                state = processPayment(state, action, false);
            })
            .addCase(sendPaymentAction.rejected, (state) => {
                state.sendPaymentStatus = ERROR_STATUS;
            })
            .addCase(getAllPaymentsAction.pending, (state) => {
                state.getAllPaymentsListStatus = LOADING_STATUS;
            })
            .addCase(getAllPaymentsAction.fulfilled, (state, action) => {
                state = processPaymentRecordList(state, action)
            })
            .addCase(getAllPaymentsAction.rejected, (state) => {
                state.getAllPaymentsListStatus = ERROR_STATUS;
            });
    }
});

const { actions, reducer } = gamesSlice;

export const { userReceivedFromWs, paymentReceivedFromWs } = actions;

export default reducer;
