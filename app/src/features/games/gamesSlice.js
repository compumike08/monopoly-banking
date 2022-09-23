import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { IDLE_STATUS, LOADING_STATUS, ERROR_STATUS } from "../../constants/general";
import { formatNumberAsCurrency } from '../../utils/util';
import { createNewGame, addNewPlayerToGame, fetchGameByCode, joinGameAsExistingPlayer, authenticate, registerSuccessfulLoginForJwt } from "../../api/gamesAPI";
import { sendPayment, getAllPaymentsList } from '../../api/paymentsAPI';

const initialState = {
    activeGame: {
        gameId: null,
        code: null,
        players: [],
        moneySinks: [],
        loggedInPlayerId: null,
        paymentRecords: []
    },
    fetchExistingGameByCodeStatus: IDLE_STATUS,
    createNewGameStatus: IDLE_STATUS,
    addNewPlayerToGameStatus: IDLE_STATUS,
    joinGameAsExistingPlayerStatus: IDLE_STATUS,
    sendPaymentStatus: IDLE_STATUS,
    getAllPaymentsListStatus: IDLE_STATUS
};

export const createNewGameAction = createAsyncThunk(
    'games/createNewGameAction',
    async (data) => {
        return await createNewGame(data);
    }
);

export const addNewPlayerToGameAction = createAsyncThunk(
    'games/addNewPlayerToGameAction',
    async (data) => {
        const addPlayerResponse = await addNewPlayerToGame(data.gameId, data);
        const token = await authenticate(addPlayerResponse.code);
        registerSuccessfulLoginForJwt(addPlayerResponse.code, token);

        return addPlayerResponse;
    }
);

export const joinGameAsExistingPlayerAction = createAsyncThunk(
    'games/joinGameAsExistingPlayerAction',
    async (data) => {
        const joinGameUserResponse = await joinGameAsExistingPlayer(data.gameId, data.playerCode);
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
    const { isFromSink, isToSink, fromPlayer, toPlayer, fromMoneySink, toMoneySink, amountPaid, payRequestUUID } = action.payload;
    state.sendPaymentStatus = IDLE_STATUS;

    let fromObject = null;
    let toObject = null;
    
    if (!isFromSink) {
        const playerIndex = state.activeGame.players.findIndex(player => player.id === fromPlayer.id);
        if (playerIndex > -1) {
            state.activeGame.players[playerIndex] = fromPlayer;
            fromObject = fromPlayer;
        }
    } else {
        const sinkIndex = state.activeGame.moneySinks.findIndex(sink => sink.id === fromMoneySink.id);
        if (sinkIndex > -1) {
            state.activeGame.moneySinks[sinkIndex] = fromMoneySink;
            fromObject = fromMoneySink;
        }
    }

    if (!isToSink) {
        const playerIndex = state.activeGame.players.findIndex(player => player.id === toPlayer.id);
        if (playerIndex > -1) {
            state.activeGame.players[playerIndex] = toPlayer;
            toObject = toPlayer;
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
        const { isFromSink, isToSink, fromPlayer, toPlayer, fromMoneySink, toMoneySink, amountPaid, payRequestUUID } = paymentRecord;

        let fromObject = null;
        let toObject = null;
        
        if (!isFromSink) {
            const playerIndex = state.activeGame.players.findIndex(player => player.id === fromPlayer.id);
            if (playerIndex > -1) {
                fromObject = fromPlayer;
            }
        } else {
            const sinkIndex = state.activeGame.moneySinks.findIndex(sink => sink.id === fromMoneySink.id);
            if (sinkIndex > -1) {
                fromObject = fromMoneySink;
            }
        }

        if (!isToSink) {
            const playerIndex = state.activeGame.players.findIndex(player => player.id === toPlayer.id);
            if (playerIndex > -1) {
                toObject = toPlayer;
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
        playerReceivedFromWs(state, action) {
            state.activeGame.players.push(action.payload);
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
                state.activeGame.players = action.payload.players;
                state.activeGame.moneySinks = action.payload.moneySinks;
            })
            .addCase(createNewGameAction.rejected, (state) => {
                state.createNewGameStatus = ERROR_STATUS;
            })
            .addCase(addNewPlayerToGameAction.pending, (state) => {
                state.addNewPlayerToGameStatus = LOADING_STATUS;
            })
            .addCase(addNewPlayerToGameAction.fulfilled, (state, action) => {
                state.addNewPlayerToGameStatus = IDLE_STATUS;
                state.activeGame.players.push(action.payload);
                state.activeGame.loggedInPlayerId = action.payload.id;
            })
            .addCase(addNewPlayerToGameAction.rejected, (state) => {
                state.addNewPlayerToGameStatus = ERROR_STATUS;
            })
            .addCase(joinGameAsExistingPlayerAction.pending, (state) => {
                state.joinGameAsExistingPlayerStatus = LOADING_STATUS;
            })
            .addCase(joinGameAsExistingPlayerAction.fulfilled, (state, action) => {
                state.joinGameAsExistingPlayerStatus = IDLE_STATUS;
                state.activeGame.loggedInPlayerId = action.payload.id;
            })
            .addCase(joinGameAsExistingPlayerAction.rejected, (state) => {
                state.joinGameAsExistingPlayerStatus = ERROR_STATUS;
            })
            .addCase(fetchExistingGameByCodeAction.pending, (state) => {
                state.fetchExistingGameByCodeStatus = LOADING_STATUS;
            })
            .addCase(fetchExistingGameByCodeAction.fulfilled, (state, action) => {
                state.fetchExistingGameByCodeStatus = IDLE_STATUS;
                state.activeGame.gameId = action.payload.gameId;
                state.activeGame.code = action.payload.code;
                state.activeGame.players = action.payload.players;
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

export const { playerReceivedFromWs, paymentReceivedFromWs } = actions;

export default reducer;
